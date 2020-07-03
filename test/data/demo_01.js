const path = require('path');
const fse = require('fs-extra');
const {getParseResult, getTestCaseMap} = require('../../lib');
const testFiles = [
  // path.join(__dirname, './mocha-ts-examples/one-describe-one-it.test.ts'),
  // path.join(__dirname, './mocha-examples/it-for.test.js'),
  path.join(__dirname, './mocha-examples/one-describe-one-it.test.js'),
  // '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-ts-examples/TestLoginVerifier.spec.ts',
];

const mochaTestTreeNode = getParseResult(testFiles, {isInherit: true});
// if (needSaveTmpFiles) {
//   // console.log(mochaTestTreeNode);
//   fse.outputJsonSync(path.join(actualOutputPath, 'mocha-test-tree-node.json'), mochaTestTreeNode);
// }

const actualOutputPath = path.join(__dirname, 'mocha-test-tree-node1.json');
console.log(mochaTestTreeNode);
fse.outputJsonSync(actualOutputPath, mochaTestTreeNode);

const actualOutputPath2 = path.join(__dirname, 'mocha-test-tree-node2.json');
console.log(mochaTestTreeNode);
fse.outputJsonSync(actualOutputPath2, getTestCaseMap(mochaTestTreeNode));
