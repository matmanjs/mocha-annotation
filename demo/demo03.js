const a = {
  children: [
    {
      uuid: 'b1583657-34df-4345-aebd-cec967c05749',
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
            prelayer: 'b1583657-34df-4345-aebd-cec967c05749',
          },
          uuid: '76a503d9-942e-48aa-aff8-e463aba453b2',
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
                prelayer: '76a503d9-942e-48aa-aff8-e463aba453b2',
              },
              uuid: '18dc7613-2bf1-46f3-8faa-6adf163ea9d7',
              children: [],
              fullFile:
                '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-many-it.test.js',
              parentId: '76a503d9-942e-48aa-aff8-e463aba453b2',
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
                prelayer: '76a503d9-942e-48aa-aff8-e463aba453b2',
              },
              uuid: 'f3034159-c406-48a1-9455-fb24ca956a51',
              children: [],
              fullFile:
                '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-many-it.test.js',
              parentId: '76a503d9-942e-48aa-aff8-e463aba453b2',
            },
          ],
          fullFile:
            '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-many-it.test.js',
          parentId: 'b1583657-34df-4345-aebd-cec967c05749',
        },
      ],
      fullFile:
        '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-many-it.test.js',
      comment: {},
    },
    {
      uuid: '19183dfc-6ede-43dc-bf39-4d8f2aa5430a',
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
            prelayer: '19183dfc-6ede-43dc-bf39-4d8f2aa5430a',
          },
          uuid: '1dcf7017-5d1a-4d5d-b89b-1b88c4776317',
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
                prelayer: '1dcf7017-5d1a-4d5d-b89b-1b88c4776317',
              },
              uuid: 'ff806f11-5591-4b72-af37-6389cfc59675',
              children: [],
              fullFile:
                '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js',
              parentId: '1dcf7017-5d1a-4d5d-b89b-1b88c4776317',
            },
          ],
          fullFile:
            '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js',
          parentId: '19183dfc-6ede-43dc-bf39-4d8f2aa5430a',
        },
      ],
      fullFile:
        '/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js',
      comment: {},
    },
  ],
};

function findByTestId(mochaTestTreeNode, testId) {
  let result;

  function search(nodeInfo) {
    if (!nodeInfo) {
      return;
    }

    console.log(nodeInfo.comment && nodeInfo.comment.testid, testId);

    if (nodeInfo.comment && nodeInfo.comment.testid === testId) {
      result = nodeInfo;
      return;
    }

    if (nodeInfo.children) {
      nodeInfo.children.forEach(childNodeInfo => {
        if (!result) {
          search(childNodeInfo);
        }
      });
    }
  }

  search(mochaTestTreeNode);

  return result;
}

// console.log(findByTestId(a, 'one-describe-one-it:describe1:it1'));

function getTestCaseMap(mochaTestTreeNode, fullTitleSep) {
  const map = {};

  function search(treeNode, parentFullTitle) {
    if (!treeNode) {
      return;
    }

    if (!treeNode.parentId) {
      treeNode.fullTitle = treeNode.fullFile;
    } else if (parentFullTitle) {
      treeNode.fullTitle = [parentFullTitle, treeNode.nodeInfo && treeNode.nodeInfo.describe].join(
        fullTitleSep,
      );

      map[treeNode.fullTitle] = treeNode;

      console.log(treeNode.fullTitle);
    }

    if (treeNode.children) {
      treeNode.children.forEach(childNodeInfo => {
        search(childNodeInfo, treeNode.fullTitle);
      });
    }
  }

  search(mochaTestTreeNode);

  return map;
}

console.log(getTestCaseMap(a, '#'));
