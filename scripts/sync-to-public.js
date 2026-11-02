#!/usr/bin/env node
/**
 * Publishes a squashed release snapshot to the public repo.
 *
 * Rationale: merging the private `master` history into the public branch
 * exposes every internal commit. Instead this creates exactly ONE commit
 * whose tree is a full snapshot of the current branch, parented on the
 * current public branch tip. The public repo therefore receives one clean
 * commit per release and never sees internal history.
 *
 * Config (optional) in package.json:
 *   "twinitPublish": { "remote": "Public", "branch": "releases" }
 * Defaults: remote "Public", branch "releases".
 *
 * Usage:
 *   node scripts/sync-to-public.js            # publish the current version
 *   node scripts/sync-to-public.js --dry-run  # show what it would do
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const DRY = process.argv.includes('--dry-run');

function git(cmd, opts = {}) {
  return execSync(`git ${cmd}`, { encoding: 'utf-8', cwd: ROOT, ...opts }).trim();
}
function gitOk(cmd) {
  try {
    git(`${cmd} 2>/dev/null`);
    return true;
  } catch {
    return false;
  }
}
function die(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

// --- config ---
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'));
const cfg = pkg.twinitPublish || {};
const REMOTE = cfg.remote || 'Public';
const BRANCH = cfg.branch || 'releases';
const version = pkg.version;
if (!version) die('No "version" found in package.json');

// --- preconditions ---
if (!gitOk(`remote get-url ${REMOTE}`)) {
  die(`Remote "${REMOTE}" not found. Add it first, e.g.:\n  git remote add ${REMOTE} <public-repo-url>`);
}
if (git('status --porcelain')) {
  die('Working tree is not clean. Commit or stash your changes before publishing.');
}
const sourceBranch = git('symbolic-ref --short HEAD');

console.log(`Publishing v${version}`);
console.log(`  source branch : ${sourceBranch}`);
console.log(`  target        : ${REMOTE}/${BRANCH}`);

git(`fetch ${REMOTE}`);

const tree = git('rev-parse HEAD^{tree}');

// parent = current public branch tip, if the branch already exists
let parent = null;
if (gitOk(`rev-parse --verify ${REMOTE}/${BRANCH}`)) {
  parent = git(`rev-parse ${REMOTE}/${BRANCH}`);
  if (git(`rev-parse ${parent}^{tree}`) === tree) {
    die(`Nothing to publish: ${REMOTE}/${BRANCH} already points at this exact tree.`);
  }
} else {
  console.log(`  (no ${REMOTE}/${BRANCH} yet → first release, root commit)`);
}

const message = `chore(release): v${version}`;

if (DRY) {
  console.log(`\n[dry-run] would create commit "${message}"`);
  console.log(`[dry-run]   tree   ${tree}`);
  console.log(`[dry-run]   parent ${parent || '(none → root commit)'}`);
  console.log(`[dry-run] would push → ${REMOTE}/${BRANCH} (fast-forward)`);
  process.exit(0);
}

const parentArg = parent ? `-p ${parent}` : '';
const newCommit = git(`commit-tree ${tree} ${parentArg} -m "${message}"`);
console.log(`\n✓ created release commit ${newCommit.slice(0, 9)}`);

// No -f: if someone else advanced the public branch since our fetch, this
// (correctly) fails as a non-fast-forward instead of clobbering their push.
git(`push ${REMOTE} ${newCommit}:refs/heads/${BRANCH}`);
console.log(`✓ pushed to ${REMOTE}/${BRANCH}`);
git(`fetch ${REMOTE}`);

// Keep a local branch named <BRANCH> in sync, but ONLY when it is a distinct
// line from the branch we publish from. When BRANCH === sourceBranch (e.g. a
// repo that snapshots master -> Public/master) the local branch IS the source
// of truth and must never be moved to the squashed commit.
if (BRANCH !== sourceBranch && gitOk(`rev-parse --verify refs/heads/${BRANCH}`)) {
  git(`branch -f ${BRANCH} ${newCommit}`);
  console.log(`✓ local ${BRANCH} fast-forwarded to ${newCommit.slice(0, 9)}`);
}

console.log(`\nDone. ${REMOTE}/${BRANCH} now has one clean commit for v${version}.`);
