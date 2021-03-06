const path = require('path');
const fse = require('fs-extra');
const {getParseResult} = require('../../lib');
const testFiles = [
  '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-ts-examples/one-describe-one-it.test.ts',
  '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-ts-examples/one-describe-foreach-it.test.ts',
];

const mochaTestTreeNode = getParseResult(testFiles, {isInherit: true});
// if (needSaveTmpFiles) {
//   // console.log(mochaTestTreeNode);
//   fse.outputJsonSync(path.join(actualOutputPath, 'mocha-test-tree-node.json'), mochaTestTreeNode);
// }

const actualOutputPath = path.join(__dirname, 'mocha-test-tree-node.json');
console.log(mochaTestTreeNode);
fse.outputJsonSync(actualOutputPath, mochaTestTreeNode);
