const path = require('path');
const {getParseResult, getTestCaseMap, getTestResultMap} = require('../../');
const fse = require('fs-extra');
const yaml = require('js-yaml');
const {toXML} = require('jstoxml');

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

      const dwtJunit = [];
      Object.keys(testResultMap).forEach(fullTitle => {
        const treeNode = testResultMap[fullTitle];

        if (!treeNode || !treeNode.result) {
          return;
        }

        // https://iwiki.oa.tencent.com/pages/viewpage.action?pageId=178300630
        dwtJunit.push({
          testcase: {
            _attrs: {
              //用例执行结果，0不通过，1通过
              CaseResult: treeNode.result.state === 'passed' ? 1 : 0,
              CaseManager: treeNode.comment.author,
              // 用例类型，e2e的枚举值是1，integartion的枚举值是4，unit是5
              CaseType: '5',

              // describe
              CaseDesc: treeNode.result.fullTitle.replace(
                new RegExp(treeNode.result.title, 'gi'),
                '',
              ),

              // describe
              ClassName: treeNode.result.fullTitle.replace(
                new RegExp(treeNode.result.title, 'gi'),
                '',
              ),

              // 先默认chrome
              DeviceID: 'chrome',

              // 执行时间（毫秒）
              ExecuteTime: treeNode.result.duration || 0,

              //it/test
              MethodName: treeNode.nodeInfo.describe,

              // 空
              FtName: '',

              //从根目录开始的文件路径
              ModuleName: treeNode.fullFile,

              // 错误堆栈
              StackTrace: '',
            },
          },
        });
      });
      // console.log(dwtJunit);
      fse.outputJsonSync(path.join(PROJECT_ROOT, 'dwt-junit.json'), dwtJunit);

      fse.outputFileSync(
        path.join(PROJECT_ROOT, 'dwt-junit.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n${toXML({
          testsuites: {
            testsuite: dwtJunit,
          },
        })}`,
        'utf-8',
      );
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
