const path = require('path');
const {Parser} = require('../');
const files = [
  // '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/describe-nesting.test.js',
  // '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/describe-skip.test.js',
  // '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/dir/one-describe-one-it.test.js',
  // '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/it-for.test.js',
  // '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/it-skip.test.js',
  // '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/many-describe-many-it.test.js',
  // '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-many-it.test.js',
  '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js',
];

const outputDir = path.join(__dirname, 'tmp');

const parser = new Parser(outputDir);

// parser.parse(files);

console.log(JSON.stringify(parser.getOriginalResult(files), null, 2));
