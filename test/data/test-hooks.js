let testFiles = [];

// https://mochajs.org/#available-root-hooks
exports.mochaHooks = {
  // 普通的异步写法
  async beforeAll() {
    // console.log('[test-hooks.js] beforeAll', testFiles);
    testFiles = [];
  },

  async afterAll() {
    // console.log('[test-hooks.js] afterAll', testFiles);
    console.log(testFiles);
  },

  async afterEach(done) {
    // console.log('[test-hooks.js] afterEach');
    const {type, title, file} = this.currentTest;

    // console.log({
    //   type,
    //   title,
    //   file,
    // });

    if (testFiles.indexOf(file) < 0) {
      testFiles.push(file);
    }

    done();
  },
};
