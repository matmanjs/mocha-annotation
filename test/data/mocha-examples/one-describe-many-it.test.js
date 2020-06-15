const {expect} = require('chai');

/**
 * @author matmanjs
 * @description hello,world!
 * @other one-describe-many-it.test.js
 */
describe('一个 describe 和多个 it', function () {
  it('1 等于 1', function () {
    expect(1).to.equal(1);
  });

  /**
   * @author matmanjs-it
   * @description 2=2
   */
  it('2 等于 2', function () {
    expect(2).to.equal(2);
  });
});
