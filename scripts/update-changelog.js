#!/usr/bin/env node
/**
 * Updates CHANGELOG.md with changes since the last version.
 * - Never edits existing entries for versions that have a git tag (full releases only).
 * - Creates missing entries for (non-prerelease) tags between the first changelog version and latest tag.
 * - Creates or updates only the "next" (unreleased) entry with commits since the last tag.
 *
 * Usage: node scripts/update-changelog.js [version]
 * - version: optional. Next release version (e.g. 1.0.4). If omitted, uses version from package.json.
 *
 * Uses conventional commit types: feat -> Added, fix -> Fixed, docs -> Added,
 * feat!/fix! or BREAKING CHANGE -> Breaking, others -> Changed.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHANGELOG_PATH = path.join(ROOT, 'CHANGELOG.md');
const PACKAGE_JSON_PATH = path.join(ROOT, 'package.json');

function getPackageVersion() {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8'));
  return pkg.version;
}

/** True if version is prerelease (contains hyphen), e.g. 1.0.1-1 */
function isPrerelease(version) {
  return typeof version === 'string' && version.includes('-');
}

/** Get all non-prerelease tags in version order (newest first). Returns { tags, taggedSet, latestTag }. */
function getAllTags() {
  try {
    const out = execSync('git tag -l --sort=-version:refname 2>/dev/null', {
      encoding: 'utf-8',
      cwd: ROOT,
    });
    const allTagNames = out.trim() ? out.trim().split(/\s+/) : [];
    const tags = [];
    const taggedSet = new Set();
    for (const tagName of allTagNames) {
      const version = tagName.replace(/^v/, '');
      if (isPrerelease(version)) continue;
      tags.push({ tagName, version });
      taggedSet.add(version);
    }
    const latestTag = tags.length > 0 ? tags[0].tagName : null;
    return { tags, taggedSet, latestTag };
  } catch {
    return { tags: [], taggedSet: new Set(), latestTag: null };
  }
}

/** Parse all ## [version] entries from changelog. Returns array of { version, fullMatch, index }. fullMatch is the entire block (header + body). */
function parseAllChangelogEntries(changelog) {
  const entries = [];
  const re = /\n(## \[([^\]]+)\]( - (\d{4}-\d{2}-\d{2}))?\s*\n)([\s\S]*?)(?=\n## |\n---\s*\n|\z)/g;
  let match;
  while ((match = re.exec(changelog)) !== null) {
    entries.push({
      version: match[2],
      fullMatch: match[0],
      index: match.index,
    });
  }
  return entries;
}

/** Compare two full-release versions. Returns -1 if a < b, 0 if a === b, 1 if a > b. */
function compareVersions(a, b) {
  const parse = (v) => {
    const s = (v || '').replace(/^v/, '').split('.');
    return [parseInt(s[0], 10) || 0, parseInt(s[1], 10) || 0, parseInt(s[2], 10) || 0];
  };
  const pa = parse(a);
  const pb = parse(b);
  for (let i = 0; i < 3; i++) {
    if (pa[i] < pb[i]) return -1;
    if (pa[i] > pb[i]) return 1;
  }
  return 0;
}

function getCommitsSince(tag) {
  const range = tag ? `${tag}..HEAD` : 'HEAD';
  try {
    const out = execSync(
      `git log ${range} --pretty=format:"%H%x01%s%x01%b%x02"`,
      { encoding: 'utf-8', maxBuffer: 2 * 1024 * 1024, cwd: ROOT }
    );
    return out;
  } catch {
    return '';
  }
}

/** Get commits between two tags (fromTag..toTag). */
function getCommitsBetween(fromTag, toTag) {
  if (!fromTag || !toTag) return '';
  try {
    const out = execSync(
      `git log ${fromTag}..${toTag} --pretty=format:"%H%x01%s%x01%b%x02"`,
      { encoding: 'utf-8', maxBuffer: 2 * 1024 * 1024, cwd: ROOT }
    );
    return out;
  } catch {
    return '';
  }
}

// Parse conventional commit: type(scope)?!?: subject
function parseSubject(subject) {
  const match = subject.match(/^(\w+)(\([^)]*\))?(!)?:\s*(.+)$/);
  if (!match) return { type: 'chore', breaking: false, description: subject };
  const [, type, , breaking, description] = match;
  return {
    type: (type || 'chore').toLowerCase(),
    breaking: Boolean(breaking),
    description: (description || subject).trim(),
  };
}

function extractBreakingFromBody(body) {
  if (!body) return null;
  const lower = body.toLowerCase();
  const match = body.match(/\bbreaking\s+change[s]?:\s*([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i);
  return match ? match[1].trim() : null;
}

function isRevertCommit(subject) {
  return /^Revert "/.test(subject || '');
}

/** Returns Set of full SHAs that are reverted by a later commit in the list (git log order = newest first). */
function getRevertedShas(commits) {
  const reverted = new Set();
  for (const c of commits) {
    if (!isRevertCommit(c.subject)) continue;
    const m = (c.body || '').match(/This reverts commit ([0-9a-f]{40})/i);
    if (m) reverted.add(m[1]);
  }
  return reverted;
}

/** Extract original subject from a revert commit for changelog line. */
function getRevertedSubject(subject) {
  const m = (subject || '').match(/^Revert "(.+)"$/);
  return m ? m[1].trim() : null;
}

function categorizeCommits(commits) {
  const added = [];
  const changed = [];
  const fixed = [];
  const breaking = [];

  for (const c of commits) {
    const { type, breaking: isBreaking, description } = parseSubject(c.subject);
    const breakingNote = extractBreakingFromBody(c.body);

    if (isBreaking || breakingNote) {
      const line = breakingNote
        ? `${description} (${breakingNote})`
        : description;
      breaking.push(line);
      continue;
    }

    switch (type) {
      case 'feat':
        added.push(description);
        break;
      case 'fix':
        fixed.push(description);
        break;
      case 'docs':
        added.push(description);
        break;
      case 'style':
      case 'refactor':
      case 'perf':
      case 'chore':
      case 'ci':
      default:
        changed.push(description);
        break;
    }
  }

  return { added, changed, fixed, breaking };
}

function dedupe(list) {
  return [...new Set(list)];
}

function formatSection(title, items) {
  if (!items.length) return '';
  const deduped = dedupe(items);
  return `### ${title}\n${deduped.map((i) => `- ${i}`).join('\n')}\n`;
}

function buildEntry(version, date, sections) {
  const dateStr = date ? ` - ${date}` : '';
  let body = '';
  if (sections.breaking.length) body += formatSection('Breaking', sections.breaking);
  if (sections.added.length) body += formatSection('Added', sections.added);
  if (sections.changed.length) body += formatSection('Changed', sections.changed);
  if (sections.fixed.length) body += formatSection('Fixed', sections.fixed);
  if (!body.trim()) body = '- No changes recorded\n';
  return `## [${version}]${dateStr}\n\n${body.trim()}\n\n`;
}

// Preamble: from start until (and including) the Semantic Versioning line
function getPreamble(changelog) {
  const end = changelog.search(/\n## \[/);
  if (end === -1) return changelog;
  return changelog.slice(0, end);
}

function parseRawCommits(raw) {
  return raw
    .split('\u0002')
    .filter(Boolean)
    .map((block) => {
      const [hash, subject, body] = block.split('\u0001');
      return {
        hash: (hash || '').trim(),
        subject: (subject || '').trim(),
        body: (body || '').trim(),
      };
    })
    .filter((c) => c.hash && c.subject);
}

function buildSectionsFromCommits(commits) {
  const revertedShas = getRevertedShas(commits);
  const commitsToShow = commits.filter(
    (c) => !revertedShas.has(c.hash) && !isRevertCommit(c.subject)
  );
  const sections = categorizeCommits(commitsToShow);
  for (const c of commits) {
    if (!isRevertCommit(c.subject)) continue;
    const original = getRevertedSubject(c.subject);
    if (original) sections.changed.push(`Reverted: ${original}`);
  }
  return sections;
}

/** Get date of a tag (YYYY-MM-DD) or today if not available. */
function getTagDate(tagName) {
  try {
    const out = execSync(`git log -1 --format=%ad --date=short ${tagName} 2>/dev/null`, {
      encoding: 'utf-8',
      cwd: ROOT,
    });
    return out.trim() || new Date().toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function main() {
  const versionArg = process.argv[2];
  const nextVersion = versionArg && versionArg.trim() ? versionArg.trim() : getPackageVersion();
  const { tags, taggedSet, latestTag } = getAllTags();
  const latestTagVersion = latestTag ? tags[0].version : null;

  const changelogContent = fs.readFileSync(CHANGELOG_PATH, 'utf-8');
  const entries = parseAllChangelogEntries(changelogContent);
  const changelogVersionsSet = new Set(entries.map((e) => e.version));
  // First "release" version in changelog (skip "Unreleased" for range of missing tags)
  const firstChangelogVersion =
    entries.find((e) => e.version !== 'Unreleased')?.version ?? null;
  const preamble = getPreamble(changelogContent);
  const today = new Date().toISOString().slice(0, 10);
  let newChangelog = changelogContent;
  const actions = [];

  // Step A: Create missing entries only for tags *newer* than the first changelog release (e.g. 1.1.2+ when 1.1.1 is at top). Never add older versions (e.g. 1.0.2, 1.0.3).
  if (tags.length > 0 && firstChangelogVersion !== null && latestTagVersion !== null) {
    const missingTagInfos = [];
    for (let i = 0; i < tags.length; i++) {
      const t = tags[i];
      if (changelogVersionsSet.has(t.version)) continue;
      // Only add if tag is strictly newer than first changelog version (so 1.1.2 and above when 1.1.1 is at top)
      if (compareVersions(t.version, firstChangelogVersion) <= 0) continue;
      if (compareVersions(t.version, latestTagVersion) > 0) continue;
      const previousTag = i + 1 < tags.length ? tags[i + 1].tagName : null;
      missingTagInfos.push({ ...t, previousTag });
    }
    if (missingTagInfos.length > 0) {
      const newEntries = [];
      for (const { tagName, version, previousTag } of missingTagInfos) {
        const raw = previousTag ? getCommitsBetween(previousTag, tagName) : getCommitsSince(null);
        const commits = parseRawCommits(raw);
        const sections = buildSectionsFromCommits(commits);
        const date = getTagDate(tagName);
        newEntries.push(buildEntry(version, date, sections));
        actions.push(`added ${version}`);
      }
      const fromFirstEntry = newChangelog.search(/\n## \[/);
      const rest = fromFirstEntry === -1 ? '' : newChangelog.slice(fromFirstEntry);
      newChangelog = preamble + '\n\n' + newEntries.join('') + (rest ? '\n' + rest : '');
    }
  }

  // Step B: Create or update the "next" version entry (only if there are commits since latest tag)
  const rawNext = getCommitsSince(latestTag);
  const commitsNext = parseRawCommits(rawNext);
  if (commitsNext.length > 0) {
    // If nextVersion equals the latest tag, use "Unreleased" so we don't create a duplicate tagged entry
    const effectiveNextVersion =
      latestTagVersion && nextVersion === latestTagVersion ? 'Unreleased' : nextVersion;
    const entriesAfterA = parseAllChangelogEntries(newChangelog);
    const firstEditable = entriesAfterA.find(
      (e) =>
        (e.version === effectiveNextVersion || e.version === 'Unreleased') &&
        !taggedSet.has(e.version)
    );
    const sections = buildSectionsFromCommits(commitsNext);
    const newEntry = buildEntry(effectiveNextVersion, today, sections);

    if (firstEditable) {
      const prefix = newChangelog.slice(0, firstEditable.index);
      const separator = prefix.endsWith('\n\n') ? '' : prefix.endsWith('\n') ? '\n' : '\n\n';
      newChangelog =
        prefix +
        separator +
        newEntry +
        newChangelog.slice(firstEditable.index + firstEditable.fullMatch.length);
      actions.push(`refreshed ${effectiveNextVersion}`);
    } else {
      const fromFirstEntry = newChangelog.search(/\n## \[/);
      const rest = fromFirstEntry === -1 ? '' : newChangelog.slice(fromFirstEntry);
      newChangelog = preamble + '\n\n' + newEntry + (rest ? '\n' + rest : '');
      actions.push(`added ${effectiveNextVersion}`);
    }
  }

  if (actions.length > 0) {
    fs.writeFileSync(CHANGELOG_PATH, newChangelog, 'utf-8');
    console.log(`CHANGELOG.md updated: ${actions.join(', ')}.`);
  } else {
    console.log('CHANGELOG.md unchanged (no missing tagged entries and no commits since latest tag).');
  }
}

main();
