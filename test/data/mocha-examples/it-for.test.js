const {expect} = require('chai');

/**
 * @author matmanjs
 * @description hello,world!
 * @other it-for.test.js
 * @testid it-for:describe1
 */
describe('验证 for 循环产生 it', function () {
  for (let i = 0; i < 3; i++) {
    /**
     * @description it in for
     * @testid it-for:describe1:itfor
     */
    it(`循环验证： ${i} 等于 ${i} `, function () {
      expect(i).to.equal(i);
    });
  }

  /**
   * @description not in for
   * @testid it-for:describe1:it2
   */
  it('对比：不是 for 产生', function () {
    expect(2).to.equal(2);
  });
});
