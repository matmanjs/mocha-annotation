const {expect} = require('chai');

describe('一个 describe 和多个 it', function () {
  it('1 等于 1', function () {
    expect(1).to.equal(1);
  });

  it('2 等于 2', function () {
    expect(2).to.equal(2);
  });
});
