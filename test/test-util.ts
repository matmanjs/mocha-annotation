import {MochaTestTreeNode} from '../src/types';

export function findByTestId(
  mochaTestTreeNode: MochaTestTreeNode,
  testId: string,
): MochaTestTreeNode | null {
  let result = null;
  let isFound = false;

  function search(nodeInfo: MochaTestTreeNode) {
    if (!nodeInfo) {
      return;
    }

    if (nodeInfo.comment && nodeInfo.comment.testid === testId) {
      result = nodeInfo;
      isFound = true;
      return;
    }

    if (nodeInfo.children) {
      nodeInfo.children.forEach(childNodeInfo => {
        if (!isFound) {
          search(childNodeInfo);
        }
      });
    }
  }

  search(mochaTestTreeNode);

  return result;
}
