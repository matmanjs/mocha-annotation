const {expect} = require('chai');

/**
 * @author matmanjs
 * @description hello,ts!
 * @other ts-one-describe-one-it.test.ts
 * @testid ts-one-describe-one-it:describe1
 */
describe('一个 describe 和一个 it', function () {
  const context: any = global.context || {};
  console.log(context);

  /**
   * @testid ts-one-describe-one-it:describe1:it1
   */
  it('1 等于 1', function () {
    expect(1).to.equal(1);
  });
});
