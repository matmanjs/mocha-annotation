import 'mocha';
import {expect} from 'chai';
import {Parser} from '../../src/parser';
import {MochaTestTreeNode} from '../../src/types';
import {findByTestId} from '../test-util';

describe('测试 parser', function () {
  describe('getParseResult and isInherit is false', function () {
    let mochaTestTreeNode: MochaTestTreeNode;

    before(function () {
      // const files = glob
      //   .sync('**/*.test.js', {
      //     cwd: srcDir,
      //     dot: true,
      //   })
      //   .map(item => path.join(srcDir, item));

      const files = [
        // '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/describe-nesting.test.js',
        // '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/describe-skip.test.js',
        // '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/dir/one-describe-one-it.test.js',
        // '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/it-for.test.js',
        // '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/it-skip.test.js',
        // '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/many-describe-many-it.test.js',
        '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-many-it.test.js',
        '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js',
      ];
      mochaTestTreeNode = new Parser(__dirname).getParseResult(files, {isInherit: true});
    });

    it('getParseResult and isInherit is false', function () {
      const nodeInfo = findByTestId(mochaTestTreeNode, 'one-describe-one-it:describe1:it1');
      expect(nodeInfo && nodeInfo.comment).to.eql({
        author: 'matmanjs',
        description: 'hello,world!',
        other: 'one-describe-one-it.test.js',
        testid: 'one-describe-one-it:describe1:it1',
      });
    });
  });
});
