const path = require('path');
const {Parser} = require('../');
const files = [
  // '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/describe-nesting.test.js',
  // '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/describe-skip.test.js',
  // '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/dir/one-describe-one-it.test.js',
  // '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/it-for.test.js',
  // '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/it-skip.test.js',
  // '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/many-describe-many-it.test.js',
  '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-many-it.test.js',
  '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js',
];

const outputDir = path.join(__dirname, 'tmp');

const mochewesomeJsonPath =
  '/Users/helinjiang/gitprojects/mocha-annotation/test/data/.test_output/mochawesome.json';

const parser = new Parser(outputDir);

// parser.parse(files);

// console.log(JSON.stringify(parser.getOriginalResult(files), null, 2));
// console.log(JSON.stringify(parser.getParseResult(files, {isInherit: true}), null, 2));
// console.log(parser.getParseResult(files, {isInherit: true}));

const treeNode = {
  children: [
    {
      uuid: '0b414dca-12b2-41bb-ba42-dca8cf238b76',
      children: [
        {
          comment: {
            author: 'matmanjs',
            description: 'hello,world!',
            other: 'one-describe-many-it.test.js',
          },
          nodeInfo: {
            describe: '一个 describe 和多个 it',
            callee: 'describe',
            prelayer: '0b414dca-12b2-41bb-ba42-dca8cf238b76',
          },
          uuid: 'adab1dc3-487d-4a7f-b775-a98afa9dcb90',
          children: [
            {
              nodeInfo: {
                describe: '1 等于 1',
                callee: 'it',
                prelayer: 'adab1dc3-487d-4a7f-b775-a98afa9dcb90',
              },
              uuid: '58968075-f313-4527-8f8b-43927e8b4a09',
              children: [],
            },
            {
              comment: {
                author: 'matmanjs-it',
                description: '2=2',
              },
              nodeInfo: {
                describe: '2 等于 2',
                callee: 'it',
                prelayer: 'adab1dc3-487d-4a7f-b775-a98afa9dcb90',
              },
              uuid: '88d02d6a-7427-46a9-8285-5e348f956dd8',
              children: [],
            },
          ],
        },
      ],
      fullFile:
        '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-many-it.test.js',
    },
    {
      uuid: '7c048b71-cab3-44ec-8065-69623ea1581e',
      children: [
        {
          comment: {
            author: 'matmanjs',
            description: 'hello,world!',
            other: 'one-describe-one-it.test.js',
          },
          nodeInfo: {
            describe: '一个 describe 和一个 it',
            callee: 'describe',
            prelayer: '7c048b71-cab3-44ec-8065-69623ea1581e',
          },
          uuid: '3f04b6e3-a692-451d-bfa8-60a20ffa822c',
          children: [
            {
              nodeInfo: {
                describe: '1 等于 1',
                callee: 'it',
                prelayer: '3f04b6e3-a692-451d-bfa8-60a20ffa822c',
              },
              uuid: 'd7b9cb59-a2fb-4dba-9032-d95f7b7d31e9',
              children: [],
            },
          ],
        },
      ],
      fullFile:
        '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js',
    },
  ],
};

function test(res) {
  function handleInherit(nodeInfo) {
    if (!nodeInfo) {
      return;
    }

    if (nodeInfo.children) {
      nodeInfo.children.forEach(childNodeInfo => {
        // 设置测试文件的完整路径
        if (nodeInfo.fullFile && !childNodeInfo.fullFile) {
          childNodeInfo.fullFile = nodeInfo.fullFile;
        }

        // 设置父节点的id
        childNodeInfo.parentId = nodeInfo.uuid;

        // 向上继承注解
        childNodeInfo.comment = Object.assign({}, nodeInfo.comment, childNodeInfo.comment);

        handleInherit(childNodeInfo);
      });
    }
  }

  handleInherit(res);

  return res;
}

console.log(JSON.stringify(test(treeNode), null, 2));
