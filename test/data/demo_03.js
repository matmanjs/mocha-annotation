const glob = require('glob');
const path = require('path');
const fse = require('fs-extra');
const {getParseResult, getTestCaseMap, getTestResultMap} = require('../../lib');

const MOCHA_EXAMPLES_PATH = path.join(__dirname, './mocha-examples');
const MOCHAWESOME_PATH = path.join(__dirname, './.test_output/mochawesome.json');

const files = glob
  .sync('**/*.test.js', {
    cwd: MOCHA_EXAMPLES_PATH,
    dot: true,
  })
  .map(item => path.join(MOCHA_EXAMPLES_PATH, item));

const mochaTestTreeNode = getParseResult(files, {isInherit: true});
const testCaseMap = getTestCaseMap(mochaTestTreeNode, ' ');
const testResultMap = getTestResultMap(mochaTestTreeNode, MOCHAWESOME_PATH);

fse.outputJsonSync(path.join(__dirname, 'm-mocha-test-tree-node.json'), mochaTestTreeNode);
fse.outputJsonSync(path.join(__dirname, 'm-test-case-map.json'), testCaseMap);
fse.outputJsonSync(path.join(__dirname, 'm-test-result-map.json'), testResultMap);

console.log(Object.keys(testCaseMap), Object.keys(testCaseMap).length);
console.log(Object.keys(testResultMap), Object.keys(testResultMap).length);

Object.keys(testResultMap).forEach(item => {
  if (Object.keys(testCaseMap).indexOf(item) < 0) {
    console.log(item);
  }
});
