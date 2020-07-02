const assert = require('assert');
const fs = require('fs');
const path = require('path');
const sourcemapView = require('../');

const sourcemapFile = path.resolve(__dirname, './__fixtures__/bundle.js.map');
const sourcemapRaw = fs.readFileSync(sourcemapFile, { encoding: 'utf-8'});
const sourcemap = JSON.parse(sourcemapRaw);

const view = sourcemapView(sourcemap);

// hit 'user'
assert.deepStrictEqual(view(1, 987), {
  file: 'webpack:///./index.js',
  lineNo: 7,
  colNo: 16,
  name: 'user',
  content: sourcemap.sourcesContent[1],
});

// hit 'age'
assert.deepStrictEqual(view(1, 1010), {
  file: 'webpack:///./index.js',
  lineNo: 7,
  colNo: 46,
  name: 'age',
  content: sourcemap.sourcesContent[1],
});

// hit nothing
assert.equal(view(1, 123), null);

console.log('all tests passed!');
