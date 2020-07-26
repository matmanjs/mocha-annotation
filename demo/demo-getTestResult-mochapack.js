const mochaTestTreeNode = require('../test/data/mochapack/unit/mocha-test-tree-node.json');

const {getTestResultMap} = require('../lib');

const testResultMap = getTestResultMap(mochaTestTreeNode, {
  fullTitleSep: '#',
  mochawesomeJsonFile:
    '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mochapack/mochawesome/mochawesome.json',
});

console.log(JSON.stringify(testResultMap, null, 2));
