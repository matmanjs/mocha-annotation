import path from 'path';
import glob from 'glob';
import 'mocha';
import {expect} from 'chai';
import {Parser} from '../../src/parser';
import {MochaTestTreeNode} from '../../src/types';
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

      // const files = [
      //   '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/describe-nesting.test.js',
      //   '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/describe-skip.test.js',
      //   '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/dir/one-describe-one-it.test.js',
      //   '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/it-for.test.js',
      //   '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/it-skip.test.js',
      //   '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/many-describe-many-it.test.js',
      //   '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-many-it.test.js',
      //   '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js',
      // ];
      mochaTestTreeNode = new Parser(__dirname).getParseResult(files, {isInherit: false});
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

      mochaTestTreeNode = new Parser(__dirname).getParseResult(files, {isInherit: true});
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
});
