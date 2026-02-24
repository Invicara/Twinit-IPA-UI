#!/usr/bin/env node
/**
 * Suggests the next stable version based on conventional commits since the latest tag.
 * - Breaking changes → major
 * - No breaking, at least one feat → minor
 * - No breaking, no feats → patch
 *
 * Dry-run only (does not modify files).
 * With no commits since last tag, suggests "No release".
 */

const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

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

// Parse tag to base version (strip "v" and any pre-release suffix)
function parseBaseVersion(tag) {
  if (!tag) return null;
  const withoutV = tag.replace(/^v/i, '');
  const base = withoutV.split('-')[0];
  const parts = base.split('.').map((n) => parseInt(n, 10));
  if (parts.length < 3 || parts.some(Number.isNaN)) return null;
  return { major: parts[0], minor: parts[1], patch: parts[2] };
}

function nextVersion(base, bump) {
  if (bump === 'major') return `${base.major + 1}.0.0`;
  if (bump === 'minor') return `${base.major}.${base.minor + 1}.0`;
  return `${base.major}.${base.minor}.${base.patch + 1}`;
}

function isBreaking(subject, body) {
  if (!subject) return false;
  if (/^(\w+)(\([^)]*\))?!:\s/.test(subject)) return true;
  const b = (body || '').toLowerCase();
  return b.includes('breaking change:') || b.includes('breaking changes:');
}

function parseType(subject) {
  const m = subject.match(/^(\w+)(\([^)]*\))?!?:\s/);
  return m ? m[1].toLowerCase() : null;
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

function main() {
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
  const commitsToCount = commits.filter(
    (c) => !revertedShas.has(c.hash) && !isRevertCommit(c.subject)
  );

  if (commitsToCount.length === 0) {
    console.log(
      commits.length === 0
        ? 'Suggested: No release (no commits since last tag).'
        : 'Suggested: No release (no changes after excluding reverted commits).'
    );
    if (tag) console.log(`Last tag: ${tag}`);
    process.exit(0);
    return;
  }

  let breaking = 0;
  let feat = 0;
  let fix = 0;
  let docs = 0;
  let other = 0;

  for (const c of commitsToCount) {
    if (isBreaking(c.subject, c.body)) {
      breaking++;
      continue;
    }
    const type = parseType(c.subject);
    switch (type) {
      case 'feat':
        feat++;
        break;
      case 'fix':
        fix++;
        break;
      case 'docs':
        docs++;
        break;
      default:
        other++;
        break;
    }
  }

  const base = parseBaseVersion(tag);
  if (!base) {
    console.log('Could not parse version from last tag. Last tag:', tag || '(none)');
    process.exit(1);
  }

  const bump = breaking > 0 ? 'major' : feat > 0 ? 'minor' : 'patch';
  const suggested = nextVersion(base, bump);

  const summaryParts = [];
  if (breaking) summaryParts.push(`${breaking} breaking`);
  if (feat) summaryParts.push(`${feat} feat(s)`);
  if (fix) summaryParts.push(`${fix} fix(es)`);
  if (docs) summaryParts.push(`${docs} doc(s)`);
  if (other) summaryParts.push(`${other} other`);

  console.log(`Suggested version: ${suggested} (${bump})`);
  console.log(summaryParts.join(', '));
  if (tag) console.log(`Since: ${tag}`);
  process.exit(0);
}

main();
