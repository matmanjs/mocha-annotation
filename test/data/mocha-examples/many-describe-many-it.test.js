const {expect} = require('chai');

describe('多个 describe 和多个 it 之一', function () {
  it('1 等于 1', function () {
    expect(1).to.equal(1);
  });
});

describe('多个 describe 和多个 it 之二', function () {
  it('1 等于 1', function () {
    expect(1).to.equal(1);
  });

  it('2 等于 2', function () {
    expect(2).to.equal(2);
  });
});
