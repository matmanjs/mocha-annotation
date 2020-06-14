const {expect} = require('chai');

describe.skip('验证describe.skip: 已设置', function () {
  it('1 等于 1', function () {
    expect(1).to.equal(1);
  });
});

describe('验证describe.skip: 对照组未设置', function () {
  it('1 等于 1', function () {
    expect(1).to.equal(1);
  });
});
