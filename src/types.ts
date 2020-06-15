export interface NodeInfo {
  // 节点描述，即 describe() 和 it() 方法的第一个参数
  describe: string;

  // 调用者，目前有两个值： describe 和 it
  callee: string;

  // loc: any;
  prelayer: string;
}

export interface TreeNode {
  uuid?: string;

  // 子节点
  children?: TreeNode[];

  // 该节点信息
  nodeInfo?: NodeInfo;

  // 注解信息
  comment?: {[key: string]: any};

  // 完整的文件路径
  fullFile?: string;
}

export interface MochaSource {
  fullFile: string;
  tests: {
    fullTitle: string;
  }[];
  suites: MochaSource[];
}

/**
 * 测试用例
 */
export interface MochaTestTreeNode {
  uuid?: string;

  // 父节点 id
  parentId?: string;

  parent?: MochaTestTreeNode;

  // 子节点们
  children?: MochaTestTreeNode[];

  // 该节点信息
  nodeInfo?: NodeInfo;

  // 注解信息
  comment?: {[key: string]: any};

  // 完整的文件名
  fullTitle?: string;

  // 完整的文件路径
  fullFile?: string;

  // 测试结果
  status?: ['success' | 'fail'];

  // 测试结果的详细信息，从 mochawesome 获得
  results?: MochaSource[];
}

export interface TestCaseMap {
  [key: string]: MochaTestTreeNode;
}
