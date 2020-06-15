const mochaTestTreeNode = {
  children: [
    {
      fullFile:
        '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/describe-nesting.test.js',
      uuid: 'd30910b5-7622-4a4c-980a-758dfb426302',
      children: [
        {
          comment: {},
          nodeInfo: {
            describe: '嵌套的 describe',
            callee: 'describe',
            prelayer: 'd30910b5-7622-4a4c-980a-758dfb426302',
          },
          uuid: 'b599d6d8-6d82-4e0b-b540-70a09de29cc9',
          children: [
            {
              comment: {},
              nodeInfo: {
                describe: '嵌套的 describe 之一',
                callee: 'describe',
                prelayer: 'b599d6d8-6d82-4e0b-b540-70a09de29cc9',
              },
              uuid: '0d5b7ec5-8797-43d3-8f5a-20c84c49558e',
              children: [
                {
                  comment: {},
                  nodeInfo: {
                    describe: '1 等于 1',
                    callee: 'it',
                    prelayer: '0d5b7ec5-8797-43d3-8f5a-20c84c49558e',
                  },
                  uuid: '2e1d7efa-88ec-4f62-8a5a-fa58f4c2855e',
                  children: [],
                  fullFile:
                    '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/describe-nesting.test.js',
                  parentId: '0d5b7ec5-8797-43d3-8f5a-20c84c49558e',
                },
              ],
              fullFile:
                '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/describe-nesting.test.js',
              parentId: 'b599d6d8-6d82-4e0b-b540-70a09de29cc9',
            },
            {
              comment: {},
              nodeInfo: {
                describe: '嵌套的 describe 之二',
                callee: 'describe',
                prelayer: 'b599d6d8-6d82-4e0b-b540-70a09de29cc9',
              },
              uuid: 'c7900084-2786-441f-a5b3-1f6457fc50c4',
              children: [
                {
                  comment: {},
                  nodeInfo: {
                    describe: '1 等于 1',
                    callee: 'it',
                    prelayer: 'c7900084-2786-441f-a5b3-1f6457fc50c4',
                  },
                  uuid: '0d7e70e6-f8de-4a4c-8c54-bc94d250259d',
                  children: [],
                  fullFile:
                    '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/describe-nesting.test.js',
                  parentId: 'c7900084-2786-441f-a5b3-1f6457fc50c4',
                },
                {
                  comment: {},
                  nodeInfo: {
                    describe: '2 等于 2',
                    callee: 'it',
                    prelayer: 'c7900084-2786-441f-a5b3-1f6457fc50c4',
                  },
                  uuid: 'c08cf237-41eb-4d57-9b8e-747c7533be9b',
                  children: [],
                  fullFile:
                    '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/describe-nesting.test.js',
                  parentId: 'c7900084-2786-441f-a5b3-1f6457fc50c4',
                },
              ],
              fullFile:
                '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/describe-nesting.test.js',
              parentId: 'b599d6d8-6d82-4e0b-b540-70a09de29cc9',
            },
          ],
          fullFile:
            '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/describe-nesting.test.js',
          parentId: 'd30910b5-7622-4a4c-980a-758dfb426302',
        },
      ],
      comment: {},
    },
    {
      fullFile:
        '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/describe-skip.test.js',
      uuid: '91bebfff-4db6-47ca-a81b-ba9774bc3d3a',
      children: [
        {
          comment: {},
          nodeInfo: {
            describe: '验证describe.skip: 已设置',
            callee: 'describe',
            prelayer: '91bebfff-4db6-47ca-a81b-ba9774bc3d3a',
          },
          uuid: '342ebb45-d2cc-4089-8b94-7d13e0c936c6',
          children: [
            {
              comment: {},
              nodeInfo: {
                describe: '1 等于 1',
                callee: 'it',
                prelayer: '342ebb45-d2cc-4089-8b94-7d13e0c936c6',
              },
              uuid: 'b839852b-d081-4b63-8379-c3a257a739cb',
              children: [],
              fullFile:
                '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/describe-skip.test.js',
              parentId: '342ebb45-d2cc-4089-8b94-7d13e0c936c6',
            },
          ],
          fullFile:
            '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/describe-skip.test.js',
          parentId: '91bebfff-4db6-47ca-a81b-ba9774bc3d3a',
        },
        {
          comment: {},
          nodeInfo: {
            describe: '验证describe.skip: 对照组未设置',
            callee: 'describe',
            prelayer: '91bebfff-4db6-47ca-a81b-ba9774bc3d3a',
          },
          uuid: '61fd0f7e-21d5-4405-9686-c8e75f2c5ca1',
          children: [
            {
              comment: {},
              nodeInfo: {
                describe: '1 等于 1',
                callee: 'it',
                prelayer: '61fd0f7e-21d5-4405-9686-c8e75f2c5ca1',
              },
              uuid: 'ab796f05-5177-43bc-bb91-5bd239b3cbdc',
              children: [],
              fullFile:
                '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/describe-skip.test.js',
              parentId: '61fd0f7e-21d5-4405-9686-c8e75f2c5ca1',
            },
          ],
          fullFile:
            '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/describe-skip.test.js',
          parentId: '91bebfff-4db6-47ca-a81b-ba9774bc3d3a',
        },
      ],
      comment: {},
    },
    {
      fullFile:
        '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/dir/one-describe-one-it.test.js',
      uuid: '6388f505-c2f3-41dd-945d-0a208b95a6e9',
      children: [
        {
          comment: {},
          nodeInfo: {
            describe: '一个 describe 和一个 it',
            callee: 'describe',
            prelayer: '6388f505-c2f3-41dd-945d-0a208b95a6e9',
          },
          uuid: '8b0dd818-884f-4a65-b055-36fbe4729575',
          children: [
            {
              comment: {},
              nodeInfo: {
                describe: '1 等于 1',
                callee: 'it',
                prelayer: '8b0dd818-884f-4a65-b055-36fbe4729575',
              },
              uuid: '17105be9-7b6f-4422-9af9-faa422531fda',
              children: [],
              fullFile:
                '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/dir/one-describe-one-it.test.js',
              parentId: '8b0dd818-884f-4a65-b055-36fbe4729575',
            },
          ],
          fullFile:
            '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/dir/one-describe-one-it.test.js',
          parentId: '6388f505-c2f3-41dd-945d-0a208b95a6e9',
        },
      ],
      comment: {},
    },
    {
      fullFile:
        '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/it-for.test.js',
      uuid: '391ad0ac-0b01-48c9-ba2c-6df72bef1ba0',
      children: [
        {
          comment: {},
          nodeInfo: {
            describe: '验证 for 循环产生 it',
            callee: 'describe',
            prelayer: '391ad0ac-0b01-48c9-ba2c-6df72bef1ba0',
          },
          uuid: '6ec37f7e-d8bb-47f0-89cf-002b4ea0cbbb',
          children: [],
          fullFile:
            '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/it-for.test.js',
          parentId: '391ad0ac-0b01-48c9-ba2c-6df72bef1ba0',
        },
      ],
      comment: {},
    },
    {
      fullFile:
        '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/it-skip.test.js',
      uuid: '7e99d501-953e-463e-8aa8-99a1a0995539',
      children: [
        {
          comment: {},
          nodeInfo: {
            describe: '验证it.skip',
            callee: 'describe',
            prelayer: '7e99d501-953e-463e-8aa8-99a1a0995539',
          },
          uuid: '7a97cbbd-533d-4b60-b13c-b9806e4e7f02',
          children: [
            {
              comment: {},
              nodeInfo: {
                describe: '1 等于 1 ：已设置',
                callee: 'it',
                prelayer: '7a97cbbd-533d-4b60-b13c-b9806e4e7f02',
              },
              uuid: '903a23f0-98d3-4cf8-8bdf-f84b18e068e2',
              children: [],
              fullFile:
                '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/it-skip.test.js',
              parentId: '7a97cbbd-533d-4b60-b13c-b9806e4e7f02',
            },
            {
              comment: {},
              nodeInfo: {
                describe: '2 等于 2 ：对照组未设置',
                callee: 'it',
                prelayer: '7a97cbbd-533d-4b60-b13c-b9806e4e7f02',
              },
              uuid: 'e1a30415-6e54-4a71-826d-c5f7b4c81bfe',
              children: [],
              fullFile:
                '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/it-skip.test.js',
              parentId: '7a97cbbd-533d-4b60-b13c-b9806e4e7f02',
            },
          ],
          fullFile:
            '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/it-skip.test.js',
          parentId: '7e99d501-953e-463e-8aa8-99a1a0995539',
        },
      ],
      comment: {},
    },
    {
      fullFile:
        '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/many-describe-many-it.test.js',
      uuid: 'aa641b9a-d650-4233-923e-4b7b632d876c',
      children: [
        {
          comment: {},
          nodeInfo: {
            describe: '多个 describe 和多个 it 之一',
            callee: 'describe',
            prelayer: 'aa641b9a-d650-4233-923e-4b7b632d876c',
          },
          uuid: 'd0a1d8ac-d2c8-43b3-9ebe-9ab9d35576a0',
          children: [
            {
              comment: {},
              nodeInfo: {
                describe: '1 等于 1',
                callee: 'it',
                prelayer: 'd0a1d8ac-d2c8-43b3-9ebe-9ab9d35576a0',
              },
              uuid: '278c9fd8-0e40-49b2-b172-1cc85805a3d6',
              children: [],
              fullFile:
                '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/many-describe-many-it.test.js',
              parentId: 'd0a1d8ac-d2c8-43b3-9ebe-9ab9d35576a0',
            },
          ],
          fullFile:
            '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/many-describe-many-it.test.js',
          parentId: 'aa641b9a-d650-4233-923e-4b7b632d876c',
        },
        {
          comment: {},
          nodeInfo: {
            describe: '多个 describe 和多个 it 之二',
            callee: 'describe',
            prelayer: 'aa641b9a-d650-4233-923e-4b7b632d876c',
          },
          uuid: '9be8df4c-cee6-4c25-a4db-2364a7dd8fe1',
          children: [
            {
              comment: {},
              nodeInfo: {
                describe: '1 等于 1',
                callee: 'it',
                prelayer: '9be8df4c-cee6-4c25-a4db-2364a7dd8fe1',
              },
              uuid: 'e547db57-4813-404c-97c2-890d05d46351',
              children: [],
              fullFile:
                '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/many-describe-many-it.test.js',
              parentId: '9be8df4c-cee6-4c25-a4db-2364a7dd8fe1',
            },
            {
              comment: {},
              nodeInfo: {
                describe: '2 等于 2',
                callee: 'it',
                prelayer: '9be8df4c-cee6-4c25-a4db-2364a7dd8fe1',
              },
              uuid: '28011086-2bbd-467c-a1a5-3986a4af9bbf',
              children: [],
              fullFile:
                '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/many-describe-many-it.test.js',
              parentId: '9be8df4c-cee6-4c25-a4db-2364a7dd8fe1',
            },
          ],
          fullFile:
            '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/many-describe-many-it.test.js',
          parentId: 'aa641b9a-d650-4233-923e-4b7b632d876c',
        },
      ],
      comment: {},
    },
    {
      fullFile:
        '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-many-it.test.js',
      uuid: '4645e017-0ef0-480f-aa5c-289ac43cef3d',
      children: [
        {
          comment: {
            author: 'matmanjs',
            description: 'hello,world!',
            other: 'one-describe-many-it.test.js',
            testid: 'one-describe-many-it:describe1',
          },
          nodeInfo: {
            describe: '一个 describe 和多个 it',
            callee: 'describe',
            prelayer: '4645e017-0ef0-480f-aa5c-289ac43cef3d',
          },
          uuid: 'a5f82ef8-1c6d-4606-a27e-c2b0769f6840',
          children: [
            {
              comment: {
                author: 'matmanjs',
                description: 'hello,world!',
                other: 'one-describe-many-it.test.js',
                testid: 'one-describe-many-it:describe1:it1',
              },
              nodeInfo: {
                describe: '1 等于 1',
                callee: 'it',
                prelayer: 'a5f82ef8-1c6d-4606-a27e-c2b0769f6840',
              },
              uuid: '52290591-fe3f-4359-946c-18cc7e6d9600',
              children: [],
              fullFile:
                '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-many-it.test.js',
              parentId: 'a5f82ef8-1c6d-4606-a27e-c2b0769f6840',
            },
            {
              comment: {
                author: 'matmanjs-it',
                description: '2=2',
                other: 'one-describe-many-it.test.js',
                testid: 'one-describe-many-it:describe2:it2',
              },
              nodeInfo: {
                describe: '2 等于 2',
                callee: 'it',
                prelayer: 'a5f82ef8-1c6d-4606-a27e-c2b0769f6840',
              },
              uuid: '10a46400-6286-472d-a0af-ea786cf742cd',
              children: [],
              fullFile:
                '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-many-it.test.js',
              parentId: 'a5f82ef8-1c6d-4606-a27e-c2b0769f6840',
            },
          ],
          fullFile:
            '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-many-it.test.js',
          parentId: '4645e017-0ef0-480f-aa5c-289ac43cef3d',
        },
      ],
      comment: {},
    },
    {
      fullFile:
        '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js',
      uuid: 'eec3123c-c1b8-4f25-86fe-38a3223a34ed',
      children: [
        {
          comment: {
            author: 'matmanjs',
            description: 'hello,world!',
            other: 'one-describe-one-it.test.js',
            testid: 'one-describe-one-it:describe1',
          },
          nodeInfo: {
            describe: '一个 describe 和一个 it',
            callee: 'describe',
            prelayer: 'eec3123c-c1b8-4f25-86fe-38a3223a34ed',
          },
          uuid: '8e854232-970f-4474-a4a7-2d79b83a2382',
          children: [
            {
              comment: {
                author: 'matmanjs',
                description: 'hello,world!',
                other: 'one-describe-one-it.test.js',
                testid: 'one-describe-one-it:describe1:it1',
              },
              nodeInfo: {
                describe: '1 等于 1',
                callee: 'it',
                prelayer: '8e854232-970f-4474-a4a7-2d79b83a2382',
              },
              uuid: '457e26b4-2deb-4198-bdf0-3afc5e8209a6',
              children: [],
              fullFile:
                '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js',
              parentId: '8e854232-970f-4474-a4a7-2d79b83a2382',
            },
          ],
          fullFile:
            '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js',
          parentId: 'eec3123c-c1b8-4f25-86fe-38a3223a34ed',
        },
      ],
      comment: {},
    },
  ],
};

const {getTestCaseMap} = require('../lib');

const testCaseMap = getTestCaseMap(mochaTestTreeNode, '#');

// console.log(JSON.stringify(testCaseMap, null, 2));
console.log(Object.keys(testCaseMap));
