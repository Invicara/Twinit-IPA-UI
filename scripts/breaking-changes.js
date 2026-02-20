#!/usr/bin/env node
/**
 * Lists commits since the latest tag that contain breaking changes.
 * Breaking changes are detected via:
 * - Subject line: feat!: ..., fix(scope)!: ... (exclamation after type/scope)
 * - Footer line: BREAKING CHANGE: or BREAKING CHANGES:
 *
 * Run before updating CHANGELOG to ensure breaking changes are documented
 * and version bump is major when applicable.
 */

const { execSync } = require('child_process');

function getLatestTag() {
  try {
    const out = execSync('git describe --tags --abbrev=0 2>/dev/null', {
      encoding: 'utf-8',
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
      `git log ${range} --pretty=format:"%h%x01%s%x01%b%x02"`,
      { encoding: 'utf-8', maxBuffer: 2 * 1024 * 1024 }
    );
    return out;
  } catch {
    return '';
  }
}

function isBreakingCommit(parts) {
  const [hash, subject, body] = parts;
  if (!subject) return false;

  // Subject: feat!: ... or fix(scope)!: ...
  if (/^(\w+)(\([^)]*\))?!:\s/.test(subject)) {
    return true;
  }

  // Footer: BREAKING CHANGE: or BREAKING CHANGES:
  const bodyLower = (body || '').toLowerCase();
  if (
    bodyLower.includes('breaking change:') ||
    bodyLower.includes('breaking changes:')
  ) {
    return true;
  }

  return false;
}

function main() {
  const tag = getLatestTag();
  const range = tag ? `since ${tag}` : 'all commits (no tag found)';
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

  const breaking = commits.filter((c) =>
    isBreakingCommit([c.hash, c.subject, c.body])
  );

  if (breaking.length === 0) {
    console.log(`No breaking changes found in commits ${range}.\n`);
    process.exit(0);
    return;
  }

  console.log(`Breaking changes in commits ${range}:\n`);
  breaking.forEach((c) => {
    console.log(`  ${c.hash}  ${c.subject}`);
  });
  console.log(
    `\n(${breaking.length} breaking commit(s). Ensure CHANGELOG has a "Breaking" subsection and consider a major version bump.)`
  );
  process.exit(0);
}

main();
