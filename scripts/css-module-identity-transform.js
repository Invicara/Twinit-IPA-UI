/**
 * Jest transform for CSS modules. Reads the CSS file, extracts class names,
 * and returns a plain object { className: "className", ... } so that spread
 * and Object.keys() work in tests (unlike identity-obj-proxy).
 */
const path = require('path');
const fs = require('fs');

const CLASS_NAME_REGEX = /\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g;

function extractClassNames(content) {
  const names = new Set();
  let match;
  while ((match = CLASS_NAME_REGEX.exec(content)) !== null) {
    names.add(match[1]);
  }
  return [...names].sort();
}

module.exports = {
  process(sourceText, sourcePath) {
    const content = sourceText || (fs.existsSync(sourcePath) ? fs.readFileSync(sourcePath, 'utf8') : '');
    const classNames = extractClassNames(content);
    const obj = classNames.reduce((acc, k) => {
      acc[k] = k;
      return acc;
    }, {});
    return { code: `module.exports = ${JSON.stringify(obj)};` };
  },
};
