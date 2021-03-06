import path from 'path';
import glob from 'glob';
import 'mocha';
import {expect} from 'chai';
import {getParseResult, getTestCaseMap, getTestResultMap} from '../../src/mocha-parser';
import {MochaTestTreeNode, TestCaseMap, TestResultMap} from '../../src/types';
import {findByTestId} from '../test-util';
import fse from 'fs-extra';

const MOCHA_EXAMPLES_PATH = path.join(__dirname, '../data/mocha-examples');
const MOCHA_TS_EXAMPLES_PATH = path.join(__dirname, '../data/mocha-ts-examples');
const MOCHAWESOME_PATH = path.join(__dirname, '../data/.test_output/mochawesome.json');

describe('测试 parser(使用 js)', function () {
  describe('getParseResult and isInherit is false', function () {
    let mochaTestTreeNode: MochaTestTreeNode;

    before(function () {
      const files = glob
        .sync('**/*.test.js', {
          cwd: MOCHA_EXAMPLES_PATH,
          dot: true,
        })
        .map(item => path.join(MOCHA_EXAMPLES_PATH, item));

      mochaTestTreeNode = getParseResult(files, {isInherit: false});
    });

    it('describe 本身支持注解', function () {
      const treeNode = findByTestId(mochaTestTreeNode, 'one-describe-one-it:describe1');

      expect(treeNode && treeNode.nodeInfo && treeNode.nodeInfo.callee).to.equal('describe');

      expect(treeNode && treeNode.comment).to.eql({
        author: 'matmanjs',
        description: 'hello,world!',
        other: 'one-describe-one-it.test.js',
        testid: 'one-describe-one-it:describe1',
      });
    });

    it('it 没有继承 describe 中的注解', function () {
      const treeNode = findByTestId(mochaTestTreeNode, 'one-describe-one-it:describe1:it1');

      expect(treeNode && treeNode.nodeInfo && treeNode.nodeInfo.callee).to.equal('it');

      expect(treeNode && treeNode.comment).to.eql({
        testid: 'one-describe-one-it:describe1:it1',
      });
    });

    it('it 中的注解保持原状', function () {
      const treeNode = findByTestId(mochaTestTreeNode, 'one-describe-many-it:describe2:it2');

      expect(treeNode && treeNode.nodeInfo && treeNode.nodeInfo.callee).to.equal('it');

      expect(treeNode && treeNode.comment).to.eql({
        author: 'matmanjs-it',
        description: '2=2',
        testid: 'one-describe-many-it:describe2:it2',
      });
    });

    it('动态生成的测试用例无法解析注解', function () {
      const treeNode = findByTestId(mochaTestTreeNode, 'it-for:describe1:itfor');

      expect(treeNode).to.be.null;
    });

    it('非动态生成的测试用例可以获得解析注解', function () {
      const treeNode = findByTestId(mochaTestTreeNode, 'it-for:describe1:it2');

      expect(treeNode && treeNode.nodeInfo && treeNode.nodeInfo.callee).to.equal('it');

      expect(treeNode && treeNode.comment).to.eql({
        description: 'not in for',
        testid: 'it-for:describe1:it2',
      });
    });
  });

  describe('getParseResult and isInherit is true', function () {
    let mochaTestTreeNode: MochaTestTreeNode;

    before(function () {
      const files = glob
        .sync('**/*.test.js', {
          cwd: MOCHA_EXAMPLES_PATH,
          dot: true,
        })
        .map(item => path.join(MOCHA_EXAMPLES_PATH, item));

      mochaTestTreeNode = getParseResult(files, {isInherit: true});
    });

    it('describe 本身支持注解', function () {
      const treeNode = findByTestId(mochaTestTreeNode, 'one-describe-one-it:describe1');

      expect(treeNode && treeNode.nodeInfo && treeNode.nodeInfo.callee).to.equal('describe');

      expect(treeNode && treeNode.comment).to.eql({
        author: 'matmanjs',
        description: 'hello,world!',
        other: 'one-describe-one-it.test.js',
        testid: 'one-describe-one-it:describe1',
      });
    });

    it('it 可以继承 describe 中的注解', function () {
      const treeNode = findByTestId(mochaTestTreeNode, 'one-describe-one-it:describe1:it1');

      expect(treeNode && treeNode.nodeInfo && treeNode.nodeInfo.callee).to.equal('it');

      expect(treeNode && treeNode.comment).to.eql({
        author: 'matmanjs',
        description: 'hello,world!',
        other: 'one-describe-one-it.test.js',
        testid: 'one-describe-one-it:describe1:it1',
      });
    });

    it('it 中的注解优先级比继承的要高', function () {
      const treeNode = findByTestId(mochaTestTreeNode, 'one-describe-many-it:describe2:it2');

      expect(treeNode && treeNode.nodeInfo && treeNode.nodeInfo.callee).to.equal('it');

      expect(treeNode && treeNode.comment).to.eql({
        author: 'matmanjs-it',
        description: '2=2',
        other: 'one-describe-many-it.test.js',
        testid: 'one-describe-many-it:describe2:it2',
      });
    });
  });

  describe('getTestCaseMap and fullTitleSep is default', function () {
    let testCaseMap: TestCaseMap;

    before(function () {
      const files = glob
        .sync('**/*.test.js', {
          cwd: MOCHA_EXAMPLES_PATH,
          dot: true,
        })
        .map(item => path.join(MOCHA_EXAMPLES_PATH, item));

      testCaseMap = getTestCaseMap(getParseResult(files, {isInherit: true}));
    });

    it('验证 one-describe-one-it.test.js 一个 describe 和一个 it 1 等于 1', function () {
      const arr = [
        path.join(__dirname, '../data/mocha-examples/one-describe-one-it.test.js'),
        '一个 describe 和一个 it',
        '1 等于 1',
      ];
      const treeNode = testCaseMap[arr.join(' ')];

      expect(treeNode).to.be.a('object');
      expect(treeNode.comment).to.eql({
        author: 'matmanjs',
        description: 'hello,world!',
        other: 'one-describe-one-it.test.js',
        testid: 'one-describe-one-it:describe1:it1',
      });
      expect(treeNode.nodeInfo && treeNode.nodeInfo.describe).to.equal('1 等于 1');
      expect(treeNode.nodeInfo && treeNode.nodeInfo.callee).to.equal('it');
    });
  });

  describe('getTestCaseMap and fullTitleSep is #', function () {
    let testCaseMap: TestCaseMap;

    before(function () {
      const files = glob
        .sync('**/*.test.js', {
          cwd: MOCHA_EXAMPLES_PATH,
          dot: true,
        })
        .map(item => path.join(MOCHA_EXAMPLES_PATH, item));

      testCaseMap = getTestCaseMap(getParseResult(files, {isInherit: true}), '#');
    });

    it('验证 one-describe-one-it.test.js#一个 describe 和一个 it#1 等于 1', function () {
      const arr = [
        path.join(__dirname, '../data/mocha-examples/one-describe-one-it.test.js'),
        '一个 describe 和一个 it',
        '1 等于 1',
      ];
      const treeNode = testCaseMap[arr.join('#')];

      expect(treeNode).to.be.a('object');
      expect(treeNode.comment).to.eql({
        author: 'matmanjs',
        description: 'hello,world!',
        other: 'one-describe-one-it.test.js',
        testid: 'one-describe-one-it:describe1:it1',
      });
      expect(treeNode.nodeInfo && treeNode.nodeInfo.describe).to.equal('1 等于 1');
      expect(treeNode.nodeInfo && treeNode.nodeInfo.callee).to.equal('it');
    });
  });

  describe('getTestResultMap and isInherit is true and opts is undefined', function () {
    let testResultMap: TestResultMap;
    let testCaseMap: TestCaseMap;
    let mochawesomeJson: any;

    const fullTitleSep = ' ';

    before(function () {
      const files = glob
        .sync('**/*.test.js', {
          cwd: MOCHA_EXAMPLES_PATH,
          dot: true,
        })
        .map(item => path.join(MOCHA_EXAMPLES_PATH, item));

      const mochaTestTreeNode = getParseResult(files, {isInherit: true});
      testCaseMap = getTestCaseMap(mochaTestTreeNode, fullTitleSep);
      testResultMap = getTestResultMap(mochaTestTreeNode);
      mochawesomeJson = fse.readJSONSync(MOCHAWESOME_PATH);
    });

    it('mochawesome.json 中总测试用例数为 18', function () {
      expect(mochawesomeJson.stats.tests).to.equal(18);
    });

    it('testCaseMap 中存在记录数为 27', function () {
      expect(Object.keys(testCaseMap)).to.have.lengthOf(27);
    });

    it('testResultMap 中存在记录数为 15 个而不是 18 个，因为循环产生的测试用例无法获得', function () {
      expect(Object.keys(testResultMap)).to.have.lengthOf(15);
    });

    it('testResultMap 中存在：验证 for 循环产生 it 对比：不是 for 产生', function () {
      const title = [
        path.join(MOCHA_EXAMPLES_PATH, './it-for.test.js'),
        '验证 for 循环产生 it',
        '对比：不是 for 产生',
      ].join(fullTitleSep);

      expect(testResultMap).to.have.any.keys(title);
    });

    it('testResultMap 中不存在：验证 for 循环产生 it 循环验证： 0 等于 0 ', function () {
      const title = [
        path.join(MOCHA_EXAMPLES_PATH, './it-for.test.js'),
        '验证 for 循环产生 it',
        '循环验证： 0 等于 0 ',
      ].join(fullTitleSep);

      expect(testResultMap).to.not.have.any.keys(title);
    });
  });

  describe('getTestResultMap and isInherit is true and opts.fullTitleSep is #', function () {
    let testResultMap: TestResultMap;
    let testCaseMap: TestCaseMap;
    let mochawesomeJson: any;

    const fullTitleSep = '#';

    before(function () {
      const files = glob
        .sync('**/*.test.js', {
          cwd: MOCHA_EXAMPLES_PATH,
          dot: true,
        })
        .map(item => path.join(MOCHA_EXAMPLES_PATH, item));

      const mochaTestTreeNode = getParseResult(files, {isInherit: true});
      testCaseMap = getTestCaseMap(mochaTestTreeNode, fullTitleSep);
      testResultMap = getTestResultMap(mochaTestTreeNode, {fullTitleSep});
      mochawesomeJson = fse.readJSONSync(MOCHAWESOME_PATH);
    });

    it('mochawesome.json 中总测试用例数为 18', function () {
      expect(mochawesomeJson.stats.tests).to.equal(18);
    });

    it('testCaseMap 中存在记录数为 27', function () {
      expect(Object.keys(testCaseMap)).to.have.lengthOf(27);
    });

    it('testResultMap 中存在记录数为 15 个而不是 18 个，因为循环产生的测试用例无法获得', function () {
      expect(Object.keys(testResultMap)).to.have.lengthOf(15);
    });

    it('testResultMap 中存在：验证 for 循环产生 it 对比：不是 for 产生', function () {
      const title = [
        path.join(MOCHA_EXAMPLES_PATH, './it-for.test.js'),
        '验证 for 循环产生 it',
        '对比：不是 for 产生',
      ].join(fullTitleSep);

      expect(testResultMap).to.have.any.keys(title);
    });

    it('testResultMap 中不存在：验证 for 循环产生 it 循环验证： 0 等于 0 ', function () {
      const title = [
        path.join(MOCHA_EXAMPLES_PATH, './it-for.test.js'),
        '验证 for 循环产生 it',
        '循环验证： 0 等于 0 ',
      ].join(fullTitleSep);

      expect(testResultMap).to.not.have.any.keys(title);
    });
  });

  describe('getTestResultMap and isInherit is true and opts.fullTitleSep is # with mochawesomeJsonFile', function () {
    let testResultMap: TestResultMap;
    let testCaseMap: TestCaseMap;
    let mochawesomeJson: any;

    const fullTitleSep = '#';

    before(function () {
      const files = glob
        .sync('**/*.test.js', {
          cwd: MOCHA_EXAMPLES_PATH,
          dot: true,
        })
        .map(item => path.join(MOCHA_EXAMPLES_PATH, item));

      const mochaTestTreeNode = getParseResult(files, {isInherit: true});
      testCaseMap = getTestCaseMap(mochaTestTreeNode, fullTitleSep);
      testResultMap = getTestResultMap(mochaTestTreeNode, {
        fullTitleSep,
        mochawesomeJsonFile: MOCHAWESOME_PATH,
      });
      mochawesomeJson = fse.readJSONSync(MOCHAWESOME_PATH);
    });

    it('mochawesome.json 中总测试用例数为 18', function () {
      expect(mochawesomeJson.stats.tests).to.equal(18);
    });

    it('testCaseMap 中存在记录数为 27', function () {
      expect(Object.keys(testCaseMap)).to.have.lengthOf(27);
    });

    it('testResultMap 中存在记录数为 18 个，因为 mochawesome.json 中就有 18 个', function () {
      expect(Object.keys(testResultMap)).to.have.lengthOf(18);
    });

    it('testResultMap 中存在：验证 for 循环产生 it 对比：不是 for 产生', function () {
      const title = [
        path.join(MOCHA_EXAMPLES_PATH, './it-for.test.js'),
        '验证 for 循环产生 it',
        '对比：不是 for 产生',
      ].join(fullTitleSep);

      expect(testResultMap).to.have.any.keys(title);
    });

    it('testResultMap 中存在：验证 for 循环产生 it 循环验证： 0 等于 0 ', function () {
      const title = [
        path.join(MOCHA_EXAMPLES_PATH, './it-for.test.js'),
        '验证 for 循环产生 it',
        '循环验证： 0 等于 0 ',
      ].join(fullTitleSep);

      expect(testResultMap).to.have.any.keys(title);
    });
  });
});

describe('测试 parser(使用 ts)', function () {
  describe('getParseResult and isInherit is false', function () {
    let mochaTestTreeNode: MochaTestTreeNode;

    before(function () {
      const files = glob
        .sync('**/*.test.ts', {
          cwd: MOCHA_TS_EXAMPLES_PATH,
          dot: true,
        })
        .map(item => path.join(MOCHA_TS_EXAMPLES_PATH, item));

      mochaTestTreeNode = getParseResult(files, {isInherit: false});
    });

    it('describe 本身支持注解', function () {
      const treeNode = findByTestId(mochaTestTreeNode, 'ts-one-describe-one-it:describe1');

      expect(treeNode && treeNode.nodeInfo && treeNode.nodeInfo.callee).to.equal('describe');

      expect(treeNode && treeNode.comment).to.eql({
        author: 'matmanjs',
        description: 'hello,ts!',
        other: 'ts-one-describe-one-it.test.ts',
        testid: 'ts-one-describe-one-it:describe1',
      });
    });

    it('it 没有继承 describe 中的注解', function () {
      const treeNode = findByTestId(mochaTestTreeNode, 'ts-one-describe-one-it:describe1:it1');

      expect(treeNode && treeNode.nodeInfo && treeNode.nodeInfo.callee).to.equal('it');

      expect(treeNode && treeNode.comment).to.eql({
        testid: 'ts-one-describe-one-it:describe1:it1',
      });
    });
  });

  describe('getParseResult and isInherit is true', function () {
    let mochaTestTreeNode: MochaTestTreeNode;

    before(function () {
      const files = glob
        .sync('**/*.test.ts', {
          cwd: MOCHA_TS_EXAMPLES_PATH,
          dot: true,
        })
        .map(item => path.join(MOCHA_TS_EXAMPLES_PATH, item));

      mochaTestTreeNode = getParseResult(files, {isInherit: true});
    });

    it('describe 本身支持注解', function () {
      const treeNode = findByTestId(mochaTestTreeNode, 'ts-one-describe-one-it:describe1');

      expect(treeNode && treeNode.nodeInfo && treeNode.nodeInfo.callee).to.equal('describe');

      expect(treeNode && treeNode.comment).to.eql({
        author: 'matmanjs',
        description: 'hello,ts!',
        other: 'ts-one-describe-one-it.test.ts',
        testid: 'ts-one-describe-one-it:describe1',
      });
    });

    it('it 可以继承 describe 中的注解', function () {
      const treeNode = findByTestId(mochaTestTreeNode, 'ts-one-describe-one-it:describe1:it1');

      expect(treeNode && treeNode.nodeInfo && treeNode.nodeInfo.callee).to.equal('it');

      expect(treeNode && treeNode.comment).to.eql({
        author: 'matmanjs',
        description: 'hello,ts!',
        other: 'ts-one-describe-one-it.test.ts',
        testid: 'ts-one-describe-one-it:describe1:it1',
      });
    });
  });

  describe('getTestCaseMap and fullTitleSep is default', function () {
    let testCaseMap: TestCaseMap;

    before(function () {
      const files = glob
        .sync('**/*.test.ts', {
          cwd: MOCHA_TS_EXAMPLES_PATH,
          dot: true,
        })
        .map(item => path.join(MOCHA_TS_EXAMPLES_PATH, item));

      testCaseMap = getTestCaseMap(getParseResult(files, {isInherit: true}));
    });

    it('验证 one-describe-one-it.test.js 一个 describe 和一个 it 1 等于 1', function () {
      const arr = [
        path.join(__dirname, '../data/mocha-ts-examples/ts-one-describe-one-it.test.ts'),
        '一个 describe 和一个 it',
        '1 等于 1',
      ];
      const treeNode = testCaseMap[arr.join(' ')];

      expect(treeNode).to.be.a('object');
      expect(treeNode.comment).to.eql({
        author: 'matmanjs',
        description: 'hello,ts!',
        other: 'ts-one-describe-one-it.test.ts',
        testid: 'ts-one-describe-one-it:describe1:it1',
      });
      expect(treeNode.nodeInfo && treeNode.nodeInfo.describe).to.equal('1 等于 1');
      expect(treeNode.nodeInfo && treeNode.nodeInfo.callee).to.equal('it');
    });
  });

  describe('getTestCaseMap and fullTitleSep is #', function () {
    let testCaseMap: TestCaseMap;

    before(function () {
      const files = glob
        .sync('**/*.test.ts', {
          cwd: MOCHA_TS_EXAMPLES_PATH,
          dot: true,
        })
        .map(item => path.join(MOCHA_TS_EXAMPLES_PATH, item));

      testCaseMap = getTestCaseMap(getParseResult(files, {isInherit: true}), '#');
    });

    it('验证 one-describe-one-it.test.js#一个 describe 和一个 it#1 等于 1', function () {
      const arr = [
        path.join(__dirname, '../data/mocha-ts-examples/ts-one-describe-one-it.test.ts'),
        '一个 describe 和一个 it',
        '1 等于 1',
      ];
      const treeNode = testCaseMap[arr.join('#')];

      expect(treeNode).to.be.a('object');
      expect(treeNode.comment).to.eql({
        author: 'matmanjs',
        description: 'hello,ts!',
        other: 'ts-one-describe-one-it.test.ts',
        testid: 'ts-one-describe-one-it:describe1:it1',
      });
      expect(treeNode.nodeInfo && treeNode.nodeInfo.describe).to.equal('1 等于 1');
      expect(treeNode.nodeInfo && treeNode.nodeInfo.callee).to.equal('it');
    });
  });
});
