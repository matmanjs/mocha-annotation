const path = require('path');
const {getParseResult, getTestCaseMap, getTestResultMap} = require('../../');
const fse = require('fs-extra');
const yaml = require('js-yaml');

let testFiles = [];
// const PROJECT_ROOT = process.cwd();
const PROJECT_ROOT = path.join(__dirname, '.test_output');
const OUTPUT_PATH = path.join(__dirname, '.test_output');

// https://mochajs.org/#available-root-hooks
exports.mochaHooks = {
  async beforeAll() {
    // 初始清理
    testFiles = [];
  },

  async afterAll() {
    // 最后的处理
    console.log(PROJECT_ROOT);
    console.log(testFiles);

    const mochaTestTreeNode = getParseResult(testFiles, {isInherit: true});
    // console.log(mochaTestTreeNode);
    fse.outputJsonSync(path.join(PROJECT_ROOT, 'mocha-test-tree-node.json'), mochaTestTreeNode);

    const testCaseMap = getTestCaseMap(mochaTestTreeNode, '#');
    // console.log(testCaseMap);
    fse.outputJsonSync(path.join(PROJECT_ROOT, 'test-case-map.json'), testCaseMap);

    const dwtCases = {};
    Object.keys(testCaseMap).forEach(fullTitle => {
      const treeNode = testCaseMap[fullTitle];

      if (!treeNode.nodeInfo || treeNode.nodeInfo.callee !== 'it') {
        return;
      }

      const caseItem = {
        describe: treeNode.nodeInfo.describe,
        case: treeNode.nodeInfo.describe,
        moduleName: treeNode.fullFile,
      };

      dwtCases[fullTitle] = {...caseItem, ...treeNode.comment};
    });
    // console.log(dwtCases);
    fse.outputJsonSync(path.join(PROJECT_ROOT, 'dwt-cases.json'), dwtCases);

    try {
      const doc = yaml.safeDump(dwtCases, {
        styles: {
          '!!null': 'canonical', // dump null as ~
        },
        sortKeys: true, // sort object keys
      });

      fse.outputFileSync(path.join(PROJECT_ROOT, 'dwt-cases.yml'), doc, 'utf-8');
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      const testResultMap = getTestResultMap(
        mochaTestTreeNode,
        path.join(OUTPUT_PATH, './mochawesome.json'),
      );
      // console.log(testResultMap);
      fse.outputJsonSync(path.join(PROJECT_ROOT, 'test-result-map.json'), testResultMap);
    }, 500);
  },

  async afterEach() {
    // 记录执行的文件
    const {file} = this.currentTest;

    if (testFiles.indexOf(file) < 0) {
      testFiles.push(file);
    }
  },
};
