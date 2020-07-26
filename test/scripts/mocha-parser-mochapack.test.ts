import path from 'path';
import 'mocha';
import {expect} from 'chai';
import {getTestResultMap} from '../../src/mocha-parser';
import {MochaTestTreeNode, TestResultMap} from '../../src/types';
import fse from 'fs-extra';

const mochawesomeJsonFile = path.join(__dirname, '../data/mochapack/mochawesome/mochawesome.json');
const mochaTestTreeNodeFile = path.join(
  __dirname,
  '../data/mochapack/unit/mocha-test-tree-node.json',
);

describe('mochapack 测试场景下的 getTestResultMap', function () {
  let testResultMap: TestResultMap;
  let mochaTestTreeNode: MochaTestTreeNode;
  let mochawesomeJson: any;

  const fullTitleSep = '#';

  before(function () {
    mochaTestTreeNode = fse.readJSONSync(mochaTestTreeNodeFile);
    testResultMap = getTestResultMap(mochaTestTreeNode, {
      fullTitleSep,
      mochawesomeJsonFile,
      mochapack: true,
    });
    mochawesomeJson = fse.readJSONSync(mochawesomeJsonFile);
  });

  it('mochawesome.json 中总测试用例数为 17', function () {
    expect(mochawesomeJson.stats.tests).to.equal(17);
  });

  it('testResultMap 中存在指定名字的用例', function () {
    const title = [
      '/Users/helinjiang/gitprojects/gift-mall/.tmp/mochapack/1595404680907/main.js',
      'Test newDev/components/FriendChoose.vue (锁定模式)',
      'anonymousChanged 无响应，出提示',
    ].join(fullTitleSep);

    expect(testResultMap).to.have.any.keys(title);
  });

  it('testResultMap 中存在指定名字用例的值正常', function () {
    const title = [
      '/Users/helinjiang/gitprojects/gift-mall/.tmp/mochapack/1595404680907/main.js',
      'Test newDev/components/FriendChoose.vue (锁定模式)',
      'anonymousChanged 无响应，出提示',
    ].join(fullTitleSep);

    expect(testResultMap[title]).to.eql({
      children: [],
      comment: {},
      fullFile:
        '/Users/helinjiang/gitprojects/gift-mall/test/unit/client/newDev/FriendChoose.spec.js',
      fullTitle:
        '/Users/helinjiang/gitprojects/gift-mall/test/unit/client/newDev/FriendChoose.spec.js#Test newDev/components/FriendChoose.vue (锁定模式)#anonymousChanged 无响应，出提示',
      nodeInfo: {
        callee: 'it',
        describe: 'anonymousChanged 无响应，出提示',
        prelayer: '65bdcad7-2c2d-44f0-90fe-b72269270f85',
      },
      parentId: '65bdcad7-2c2d-44f0-90fe-b72269270f85',
      result: {
        code:
          "cov_ru7a3fanf.f[6]++;cov_ru7a3fanf.s[19]++;wrapper.vm.anonymousChanged();cov_ru7a3fanf.s[20]++;_chai.assert.isNotArray(wrapper.emitted('anonymousChanged'));",
        context: null,
        duration: 1,
        err: {},
        fail: false,
        fullTitle:
          'Test newDev/components/FriendChoose.vue (锁定模式) anonymousChanged 无响应，出提示',
        isHook: false,
        parentUUID: '3735636b-2e00-4ffb-8aae-f187d70b32bf',
        pass: true,
        pending: false,
        skipped: false,
        speed: 'fast',
        state: 'passed',
        timedOut: false,
        title: 'anonymousChanged 无响应，出提示',
        uuid: '853f9d13-00e6-4d73-9af9-695388bb3220',
      },
      uuid: '90b80523-9e02-488f-b5ba-9f5add8a3d33',
    });
  });
});
