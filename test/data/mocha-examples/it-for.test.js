const {expect} = require('chai');

describe('验证 for 循环产生 it', function () {
  for (let i = 0; i < 3; i++) {
    it(`循环验证： ${i} 等于 ${i} `, function () {
      expect(i).to.equal(i);
    });
  }
});
