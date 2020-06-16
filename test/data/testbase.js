const path = require('path');
const createMochaHooks = require('./create-mocha-hooks');

const outputPath = path.join(__dirname, '.test_output');
const mochawesomeJsonFilePath = path.join(__dirname, '.test_output', './mochawesome.json');

// https://mochajs.org/#available-root-hooks
exports.mochaHooks = createMochaHooks(outputPath, {
  mochawesomeJsonFilePath,
  isSaveTmpFiles: true,
  isDebug: true,
  defaultComment: {
    author: 'goodboy',
    priority: 'P0',
    type: 'unit',
  },
});
