const {expect} = require('chai');

describe('嵌套的 describe', function () {
  describe('嵌套的 describe 之一', function () {
    it('1 等于 1', function () {
      expect(1).to.equal(1);
    });
  });

  describe('嵌套的 describe 之二', function () {
    it('1 等于 1', function () {
      expect(1).to.equal(1);
    });

    it('2 等于 2', function () {
      expect(2).to.equal(2);
    });
  });
});
