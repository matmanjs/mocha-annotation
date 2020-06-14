const {expect} = require('chai');

describe('验证it.skip', function () {
  it.skip('1 等于 1 ：已设置', function () {
    expect(1).to.equal(1);
  });

  it('2 等于 2 ：对照组未设置', function () {
    expect(2).to.equal(2);
  });
});
