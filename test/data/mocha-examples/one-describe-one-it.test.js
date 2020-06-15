const {expect} = require('chai');

/**
 * @author matmanjs
 * @description hello,world!
 * @other one-describe-one-it.test.js
 */
describe('一个 describe 和一个 it', function () {
  it('1 等于 1', function () {
    expect(1).to.equal(1);
  });
});
