const {expect} = require('chai');

/**
 * @author matmanjs
 * @description hello,world!
 * @other one-describe-one-it.test.js
 * @testid one-describe-one-it:describe1
 */
describe('一个 describe 和一个 it', function () {
  /**
   * @testid one-describe-one-it:describe1:it1
   */
  it('1 等于 1', function () {
    expect(1).to.equal(1);
  });
});
