import fse from 'fs-extra';
import _ from 'lodash';
import {
  MochaTestTreeNode,
  TestCaseMap,
  TestResultMap,
  MochawesomeSuite,
  MochawesomeSuiteTest,
} from './types';
import {MapNode, ProcessAST} from './processAST';
import {AstBuilder} from './astBuilder';
import {Annotation} from './annotation';

interface GetParseResultOpts {
  // 读取文件时需要的文件编码格式，默认为 utf8
  encoding?: string;

  // 是否启用继承注解的方式
  isInherit?: boolean;
}

/**
 * 获取解析结果
 *
 * @param {String | String[]} sourceFiles 源文件绝对路径数组
 * @param {GetParseResultOpts} [opts] 读取文件时需要的文件编码格式，默认为 utf8
 * @param {String} [opts.encoding] 读取文件时需要的文件编码格式，默认为 utf8
 * @param {Boolean} [opts.isInherit] 是否启用继承注解的方式
 * @return {MochaTestTreeNode}
 */
export function getParseResult(
  sourceFiles: string | string[],
  opts?: GetParseResultOpts,
): MochaTestTreeNode {
  // 设置默认值 utf8
  const encoding = (opts && opts.encoding) || 'utf8';

  // sourceFiles 可能为单个文件，将其统一转为数组处理
  if (typeof sourceFiles === 'string') {
    sourceFiles = [sourceFiles];
  }

  // console.log('Parsing source files:', sourceFiles);

  const res: MochaTestTreeNode = {children: []};

  const astBuilder = new AstBuilder();
  const processAST = new ProcessAST();
  const annotation = new Annotation([]);

  for (let i = 0, l = sourceFiles.length; i < l; i++) {
    let sourceCode = '';
    const sourceFile = sourceFiles[i];

    try {
      sourceCode = fse.readFileSync(sourceFile, encoding as 'utf8');
    } catch (err) {
      console.error(`fs.readFileSync catch error!`, sourceFile, err);
    }

    if (sourceCode.length && Array.isArray(res.children)) {
      let currentNode: MochaTestTreeNode = {
        fullFile: sourceFile,
      };

      // 解析语法树，并获得数据
      const ast = astBuilder.build(sourceCode, sourceFile);
      if (ast) {
        const res = processAST.recurse(ast) as Map<string, MapNode>;
        currentNode = _.merge({}, currentNode, annotation.run(res));
      }

      res.children.push(currentNode);
    }
  }

  // 遍历一遍，必要时做一些继承处理
  function search(treeNode: MochaTestTreeNode): void {
    if (!treeNode) {
      return;
    }

    if (treeNode.children) {
      treeNode.children.forEach(childNodeInfo => {
        // 设置测试文件的完整路径
        if (treeNode.fullFile && !childNodeInfo.fullFile) {
          childNodeInfo.fullFile = treeNode.fullFile;
        }

        // 设置父节点的id
        childNodeInfo.parentId = treeNode.uuid;

        // 若启动继承关系，则还需要额外处理
        if (opts && opts.isInherit) {
          // 向上继承注解
          childNodeInfo.comment = Object.assign({}, treeNode.comment, childNodeInfo.comment);
        }

        search(childNodeInfo);
      });
    }
  }

  search(res);

  return res;
}

/**
 * 获得测试用例的 map
 *
 * @param {MochaTestTreeNode} mochaTestTreeNode
 * @param {string} [fullTitleSep] 名字分隔符，默认是空格间隔
 */
export function getTestCaseMap(
  mochaTestTreeNode: MochaTestTreeNode,
  fullTitleSep?: string,
): TestCaseMap {
  const map: TestCaseMap = {};

  function search(treeNode: MochaTestTreeNode, parentFullTitle?: string) {
    if (!treeNode) {
      return;
    }

    if (parentFullTitle) {
      treeNode.fullTitle = [parentFullTitle, treeNode.nodeInfo && treeNode.nodeInfo.describe].join(
        fullTitleSep || ' ',
      );

      map[treeNode.fullTitle] = treeNode;

      // 仅限于 it ，忽略掉 describe
      // if (treeNode.nodeInfo && treeNode.nodeInfo.callee === 'it') {
      //   map[treeNode.fullTitle] = treeNode;
      // }
    } else {
      treeNode.fullTitle = treeNode.fullFile;
    }

    // console.log('==', treeNode.fullFile);

    if (treeNode.children) {
      treeNode.children.forEach(childNodeInfo => {
        search(childNodeInfo, treeNode.fullTitle);
      });
    }
  }

  search(mochaTestTreeNode);

  return map;
}

/**
 * 获得测试用例的 map
 *
 * @param {MochaTestTreeNode} mochaTestTreeNode
 * @param {string} mochawesomeJsonFile mochawesome.json 文件的绝对路径
 */
export function getTestResultMap(
  mochaTestTreeNode: MochaTestTreeNode,
  mochawesomeJsonFile?: string,
): TestResultMap {
  const testCaseMap = getTestCaseMap(mochaTestTreeNode);

  // 如果不传递 mochawesome.json ，则直接返回结果即可
  if (!mochawesomeJsonFile || !fse.existsSync(mochawesomeJsonFile)) {
    return {
      ...testCaseMap,
    } as TestResultMap;
  }

  const newTestResultMap: TestResultMap = {};

  // 由于语法解析只能解析部分场景，而 mochawesome.json 中有完整的用例，因此需要将两者进行合并
  // 并且 mochawesome.json 已经有测试结果了，因此直接设置测试结果
  const mochawesomeJson = fse.readJSONSync(mochawesomeJsonFile);
  const fullTitleSep = ' ';

  function search(suites: MochawesomeSuite[], parentFullTitle?: string) {
    if (!suites) {
      return;
    }

    suites.forEach(suite => {
      // describe 的 fullTitle
      const curSuiteFullTitle =
        parentFullTitle || suite.fullFile
          ? [parentFullTitle || suite.fullFile, suite.title].join(fullTitleSep || ' ')
          : suite.title;

      if (suite.tests && suite.tests.length) {
        suite.tests.forEach(suiteTest => {
          // it 的 fullTitle
          const curSuiteTestFullTitle = [suite.fullFile, suiteTest.fullTitle].join(
            fullTitleSep || ' ',
          );

          // 解析注解之后的 it 的treeNode
          const curTreeNode = testCaseMap[curSuiteTestFullTitle];

          if (curTreeNode) {
            // 既在注解解析结果中，又在 mochawesome.json 中，则直接将结果复制过来即可
            curTreeNode.result = suiteTest as MochawesomeSuiteTest;
            newTestResultMap[curSuiteTestFullTitle] = curTreeNode;
          } else {
            // 不在注解解析结果中，只在 mochawesome.json 中
            // 则说明当前的测试用例没有注解，则继承父节点的注释
            const parentTreeNode = testCaseMap[curSuiteFullTitle];
            if (parentTreeNode) {
              console.log(
                `Could not parse annotation for: ${curSuiteTestFullTitle} ! So change to inherit annotation: ${curSuiteFullTitle} !`,
              );

              // 继承父节点的信息
              testCaseMap[curSuiteTestFullTitle] = _.merge({}, parentTreeNode, {
                result: suiteTest as MochawesomeSuiteTest,
                nodeInfo: {
                  describe: suiteTest.title,
                  callee: 'it',
                  prelayer: suiteTest.uuid,
                },
                uuid: suiteTest.uuid,
                parentId: parentTreeNode.uuid,
                children: [],
                isInherit: true,
              });

              newTestResultMap[curSuiteTestFullTitle] = testCaseMap[curSuiteTestFullTitle];
            } else {
              console.error(
                `Could not parse annotation for: ${curSuiteTestFullTitle} AND could not inherit any annotation!`,
              );
            }
          }
        });
      }

      // 递归查询
      if (suite.suites && suite.suites.length) {
        search(suite.suites, curSuiteFullTitle);
      }
    });
  }

  search(mochawesomeJson.results);

  return newTestResultMap;
}
