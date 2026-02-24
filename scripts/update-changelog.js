#!/usr/bin/env node
/**
 * Updates CHANGELOG.md with changes since the last version.
 * - If an entry for the target version (or "Unreleased") exists, replaces it with generated content.
 * - Otherwise, adds a new entry at the top with the target version and today's date.
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

function getLatestTag() {
  try {
    const out = execSync('git describe --tags --abbrev=0 2>/dev/null', {
      encoding: 'utf-8',
      cwd: ROOT,
    });
    return out.trim();
  } catch {
    return null;
  }
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

// Find first entry (top-most ## [version]) to support "Unreleased" or current version
function findFirstEntry(changelog, version) {
  const first = changelog.match(/\n(## \[([^\]]+)\]( - (\d{4}-\d{2}-\d{2}))?\s*\n)([\s\S]*?)(?=\n## |\n---\s*\n|\z)/);
  if (!first) return null;
  const [fullMatch, , entryVersion, , dateValue] = first;
  const index = changelog.indexOf(fullMatch);
  if (index === -1) return null;
  const isTarget =
    entryVersion === version ||
    entryVersion === 'Unreleased';
  return isTarget
    ? {
        fullMatch,
        version: entryVersion,
        datePart: dateValue ? dateValue.trim() : null,
        index,
      }
    : null;
}

// Preamble: from start until (and including) the Semantic Versioning line
function getPreamble(changelog) {
  const end = changelog.search(/\n## \[/);
  if (end === -1) return changelog;
  return changelog.slice(0, end);
}

function main() {
  const versionArg = process.argv[2];
  const version = versionArg && versionArg.trim() ? versionArg.trim() : getPackageVersion();
  const tag = getLatestTag();
  const raw = getCommitsSince(tag);

  const commits = raw
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

  const revertedShas = getRevertedShas(commits);
  const commitsToShow = commits.filter(
    (c) => !revertedShas.has(c.hash) && !isRevertCommit(c.subject)
  );
  const sections = categorizeCommits(commitsToShow);

  // Add one line per revert under Changed: "Reverted: <original subject>"
  for (const c of commits) {
    if (!isRevertCommit(c.subject)) continue;
    const original = getRevertedSubject(c.subject);
    if (original) sections.changed.push(`Reverted: ${original}`);
  }

  const today = new Date().toISOString().slice(0, 10);
  const changelogContent = fs.readFileSync(CHANGELOG_PATH, 'utf-8');
  const existing = findFirstEntry(changelogContent, version);

  const dateForEntry = existing && existing.datePart ? existing.datePart : today;
  const newEntry = buildEntry(version, dateForEntry, sections);

  let newChangelog;
  if (existing) {
    const prefix = changelogContent.slice(0, existing.index);
    const separator = prefix.endsWith('\n\n') ? '' : prefix.endsWith('\n') ? '\n' : '\n\n';
    newChangelog =
      prefix +
      separator +
      newEntry +
      changelogContent.slice(existing.index + existing.fullMatch.length);
  } else {
    const preamble = getPreamble(changelogContent);
    const fromFirstEntry = changelogContent.search(/\n## \[/);
    const rest = fromFirstEntry === -1 ? '' : changelogContent.slice(fromFirstEntry);
    newChangelog = preamble + '\n\n' + newEntry + (rest ? '\n' + rest : '');
  }

  fs.writeFileSync(CHANGELOG_PATH, newChangelog, 'utf-8');
  console.log(
    `CHANGELOG.md updated: ${existing ? 'refreshed' : 'added'} entry for v${version} (${commits.length} commit(s)).`
  );
}

main();
