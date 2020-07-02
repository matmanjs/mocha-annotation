import path from 'path';
import glob from 'glob';
import 'mocha';
import {expect} from 'chai';
import {getParseResult, getTestCaseMap} from '../../src/mocha-parser';
import {MochaTestTreeNode, TestCaseMap} from '../../src/types';
import {findByTestId} from '../test-util';

const MOCHA_EXAMPLES_PATH = path.join(__dirname, '../data/mocha-examples');

describe('测试 parser', function () {
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
});
