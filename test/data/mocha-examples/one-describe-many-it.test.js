const {expect} = require('chai');

/**
 * @author matmanjs
 * @description hello,world!
 * @other one-describe-many-it.test.js
 * @testid one-describe-many-it:describe1
 */
describe('一个 describe 和多个 it', function () {
  /**
   * @testid one-describe-many-it:describe1:it1
   */
  it('1 等于 1', function () {
    expect(1).to.equal(1);
  });

  /**
   * @author matmanjs-it
   * @description 2=2
   * @testid one-describe-many-it:describe2:it2
   */
  it('2 等于 2', function () {
    expect(2).to.equal(2);
  });
});
