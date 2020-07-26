const mochaTestTreeNode = require('../test/data/mochapack/unit/mocha-test-tree-node.json');

const {getTestResultMap} = require('../lib');
const {getTestCaseMap} = require('../lib/mocha-parser');

const mochawesomeJsonFile =
  '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mochapack/mochawesome/mochawesome.json';

const testResultMap = getTestResultMap(mochaTestTreeNode, {
  fullTitleSep: '#',
  mochawesomeJsonFile,
  mochapack: true,
});

console.log(JSON.stringify(testResultMap, null, 2));

// let testCaseMap = getTestCaseMap(mochaTestTreeNode, '#');
//
// const mochapackFile = require(mochawesomeJsonFile).results[0].suites[0].fullFile;
//
// console.log(testCaseMap);
// const result = {};
// for (let fullTitle in testCaseMap) {
//   const item = testCaseMap[fullTitle];
//   console.log(fullTitle);
//   const arr = fullTitle.split('#');
//   if (arr.length > 1) {
//     item.originalFullFile = arr[0];
//     arr[0] = mochapackFile;
//   }
//   result[arr.join('#')] = item;
// }
//
// console.log(JSON.stringify(result, null, 2));
// console.log(mochapackFile);
