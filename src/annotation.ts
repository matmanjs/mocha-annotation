import {MapNode, MineCallExpression} from './processAST';

type CheckOutFieldsItem = string | {name: string; require: boolean};
export type CheckOutFields = string | Array<CheckOutFieldsItem>;

export interface NodeInfo {
  describe: string;
  loc: any;
  callee: string;
  prelayer: string;
}

export interface TreeNode {
  uuid?: string;
  children?: TreeNode[];
  nodeInfo?: NodeInfo;
  comment?: {[key: string]: Array<any>};
  fullFile?: string;
}

export class Annotation {
  private root: TreeNode;
  checkOutFields: Map<string, number>;

  /**
   * Annotation 构造函数
   * @param {Array | String} checkOutFields
   */
  constructor(checkOutFields: CheckOutFields) {
    this.root = {};
    this.checkOutFields = new Map([['@author', 1]]);

    // 数据校验
    if (typeof checkOutFields === 'string') {
      checkOutFields = [checkOutFields];
    }
    if (!Array.isArray(checkOutFields)) {
      return;
    }

    // 处理传入的注解解析字段
    checkOutFields.forEach((item: CheckOutFieldsItem) => {
      if (Object.prototype.toString.call(item) === '[object String]') {
        this.checkOutFields.set(`@${item}`, 0);
      } else if (Object.prototype.toString.call(item) === '[object Object]') {
        // 消除警告, 其实没有必要
        const temp = item as {name: string; require: boolean};

        if (temp.require) {
          this.checkOutFields.set(`@${temp.name}`, 1);
        } else {
          this.checkOutFields.set(`@${temp.name}`, 0);
        }
      } else {
        throw new Error('传入的配置类型不受支持');
      }
    });
  }

  private visitNode = (node: MineCallExpression): NodeInfo => {
    let callee = '';

    if (node.callee.type === 'Identifier') {
      // 直接的 it 块
      callee = node.callee.name;
    } else if (
      node.callee.type === 'CallExpression' &&
      node.callee.callee.type === 'MemberExpression' &&
      node.callee.callee.object.type === 'Identifier'
    ) {
      // it.each([1, 2, 3]) 的写法
      callee = node.callee.callee.object.name;
    } else if (
      node.callee.type === 'MemberExpression' &&
      node.callee.object.type === 'Identifier'
    ) {
      // it.skip 的写法
      callee = node.callee.object.name;
    }

    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      describe: node.arguments[0].value,
      loc: node.loc,
      callee,
      prelayer: node.prelayer,
    };
  };

  /**
   * 提取注释中的信息
   */
  private visitComment = (node: MineCallExpression): {[key: string]: Array<any>} => {
    // 验证 node 中的注解是否存在
    if (!node.leadingComments) {
      return {};
    }

    let raw = '';
    const res: {[key: string]: Array<any>} = {};

    for (const commentItem of node.leadingComments) {
      if (commentItem.type === 'CommentBlock') {
        raw += commentItem.value;
      }
    }

    raw
      .split('\n')
      .filter(item => {
        return item.search(/^\s*\*?\s*$/);
      })
      .map(item => {
        return item.trim().replace(/^\*\s*/, '');
      })
      .forEach(item => {
        const matchKey = item.match(/^@[a-zA-Z]*/);
        const matchValue = item.match(/\s.*/);

        if (matchKey !== null && matchValue !== null && this.checkOutFields.has(matchKey[0])) {
          const key = matchKey[0].replace(/^@/, '');
          const value = matchValue[0].trim();
          if (!res[key]) {
            res[key] = [];
          }

          res[key].push(value);
        }
      });

    return res;
  };

  private mountNode = (node: TreeNode): void => {
    const queue = [this.root];

    while (queue.length !== 0) {
      const item = queue.shift();
      // 验证 item 存在
      if (!item || !node.nodeInfo || !item.children) {
        continue;
      }

      if (item.uuid === node.nodeInfo.prelayer) {
        item.children.push(node);
        return;
      }
      for (const bodyItem of item.children) {
        queue.push(bodyItem);
      }
    }
  };

  clear(): void {
    this.root = {};
  }

  /**
   * 得到结果树, 以 root 为根节点
   * @param {*} flatArray
   */
  run(flatArray: Map<string, MapNode>): TreeNode {
    this.clear();
    flatArray.forEach((bodyItem, key) => {
      // 新建虚拟最高层
      if (bodyItem.type === 'VirtualLayer') {
        this.root = {
          uuid: key,
          children: [],
        };
        return;
      }

      let comment;
      if (bodyItem.leadingComments) {
        comment = this.visitComment(bodyItem);
      }
      const nodeInfo = this.visitNode(bodyItem);

      this.mountNode({comment, nodeInfo, uuid: key, children: []});
    });

    return this.root;
  }
}
