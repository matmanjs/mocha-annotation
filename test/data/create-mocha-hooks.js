const fs = require('fs');
const path = require('path');
const {getParseResult, getTestCaseMap, getTestResultMap} = require('../../');
const fse = require('fs-extra');
const yaml = require('js-yaml');
const {toXML} = require('jstoxml');

let testFiles = [];

/**
 * 创建 mocha 的 hooks
 * https://mochajs.org/#available-root-hooks
 *
 * @param {String} outputPath 产出物路径
 * @param {Object} [opts] 额外选项
 * @param {String} [opts.mochawesomeJsonFilePath] mochawesome.json 文件绝对路径
 * @param {Boolean} [opts.isDebug] 是否启动调试模式
 * @param {Boolean} [opts.isSaveTmpFiles] 是否保存中间产物
 * @return {Object}
 */
module.exports = (outputPath, opts = {}) => {
  return {
    async beforeAll() {
      // 初始清理
      testFiles = [];
    },

    async afterAll() {
      // 最后的处理
      if (opts.isDebug) {
        console.log('outputPath:', outputPath);
        console.log('opts:', opts);
        console.log('testFiles:', testFiles);
      }

      // 获取 mochaTestTreeNode
      const mochaTestTreeNode = getParseResult(testFiles, {isInherit: true});
      if (opts.isSaveTmpFiles) {
        // console.log(mochaTestTreeNode);
        fse.outputJsonSync(path.join(outputPath, 'mocha-test-tree-node.json'), mochaTestTreeNode);
      }

      // 获取测试用例 map
      const testCaseMap = getTestCaseMap(mochaTestTreeNode, '#');
      if (opts.isSaveTmpFiles) {
        // console.log(testCaseMap);
        fse.outputJsonSync(path.join(outputPath, 'test-case-map.json'), testCaseMap);
      }

      // 获取用例： dwt-cases.yml
      // https://iwiki.oa.tencent.com/pages/viewpage.action?pageId=178300619
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

        // TODO 强制开启检查几个必选字段不能缺失
        dwtCases[fullTitle] = {...caseItem, ...treeNode.comment};
      });
      if (opts.isSaveTmpFiles) {
        // console.log(dwtCases);
        fse.outputJsonSync(path.join(outputPath, 'dwt-cases.json'), dwtCases);
      }

      // 保存 dwt-cases.yml
      try {
        const doc = yaml.safeDump(dwtCases, {
          styles: {
            '!!null': 'canonical', // dump null as ~
          },
          sortKeys: true, // sort object keys
        });

        fse.outputFileSync(path.join(outputPath, 'dwt-cases.yml'), doc, 'utf-8');
      } catch (e) {
        console.error(e);
      }

      // 如果没有设置 opts.mochawesomeJsonFilePath，则后续不再处理
      if (!opts.mochawesomeJsonFilePath) {
        console.error('opts.mochawesomeJsonFilePath is unknown!', opts.mochawesomeJsonFilePath);
        return;
      }

      // 注意此处要等待 mochawesome.json 生成
      await checkAndWaitFileAvailable(opts.mochawesomeJsonFilePath, {timeout: 100});

      // 获取测试结果 map
      const testResultMap = getTestResultMap(mochaTestTreeNode, opts.mochawesomeJsonFilePath);
      if (opts.isSaveTmpFiles) {
        // console.log(testResultMap);
        fse.outputJsonSync(path.join(outputPath, 'test-result-map.json'), testResultMap);
      }

      // 获取测试报告： dwt-junit.xml
      // https://iwiki.oa.tencent.com/pages/viewpage.action?pageId=178300630
      const dwtJunit = [];
      Object.keys(testResultMap).forEach(fullTitle => {
        const treeNode = testResultMap[fullTitle];

        if (!treeNode || !treeNode.result) {
          // TODO 循环产生的 it 模块会进入此逻辑，需要再仔细考虑
          console.error('--not exist result--', fullTitle, treeNode);
          return;
        }

        dwtJunit.push({
          testcase: {
            _attrs: {
              // 用例执行结果，0不通过，1通过
              CaseResult: treeNode.result.state === 'passed' ? 1 : 0,

              // 用例owner
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
      if (opts.isSaveTmpFiles) {
        // console.log(dwtJunit);
        fse.outputJsonSync(path.join(outputPath, 'dwt-junit.json'), dwtJunit);
      }

      // 保存测试报告： dwt-junit.xml
      fse.outputFileSync(
        path.join(outputPath, 'dwt-junit.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n${toXML({
          testsuites: {
            testsuite: dwtJunit,
          },
        })}`,
        'utf-8',
      );
    },

    async afterEach() {
      // 记录执行的文件
      const {file} = this.currentTest;

      if (testFiles.indexOf(file) < 0) {
        testFiles.push(file);
      }
    },
  };
};

/**
 * 检查某个文件是否存在，一直到能够查到或者超时为止
 *
 * @param {String} checkFile 本地文件
 * @param {Object} [opts] 选项
 * @param {Number} [opts.retryLimit] 最多重试次数
 * @param {Number} [opts.count] 当前重试次数
 * @param {Number} [opts.timeout] 每次重试之后需要等待的时间，单位为ms
 * @return {Promise}
 * @author linjianghe
 */
async function checkAndWaitFileAvailable(checkFile, opts = {}) {
  if (!opts.count) {
    opts.count = 0;
  }

  if (!opts.retryLimit) {
    opts.retryLimit = 10;
  }

  if (!opts.timeout) {
    opts.timeout = 1000;
  }

  const result = await fs.existsSync(checkFile);

  if (result) {
    console.log(`checkAndWaitFileAvailable return true!`, checkFile, opts);
    return true;
  } else if (opts.count >= opts.retryLimit) {
    console.error(`retry max! ${opts.count}/${opts.retryLimit}`);
    return Promise.reject(new Error('retry max'));
  } else {
    opts.count++;

    console.log(`check again: ${opts.count}/${opts.retryLimit}, waiting ${opts.timeout}ms`);

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        checkAndWaitFileAvailable(checkFile, opts)
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      }, opts.timeout);
    });
  }
}
