import {Parser} from './parser';
import {Annotation, TreeNode, NodeInfo} from '../annotation';

/**
 *
 */
interface NameMapItem {
  comment: {[key: string]: any};
  nodeInfo: NodeInfo;
}

/**
 * 将 TreeNode 拓展出 parent 属性
 */
export interface CommentNode extends TreeNode {
  children?: CommentNode[];
  parent?: CommentNode;
}

export class CommentParser extends Parser {
  annotation: Annotation;
  fullName: string[];
  fullNameMap: {[key: string]: NameMapItem};
  source: CommentNode;

  constructor(annotation: Annotation, path = '') {
    super(path);
    this.annotation = annotation;
    this.fullName = [];
    this.fullNameMap = {};
    this.source = {};
  }

  /**
   * 得到 fullTitle
   */
  private getFullTitle = (node: CommentNode): void => {
    if (node.parent && node.parent.nodeInfo && node.parent.nodeInfo.describe) {
      this.fullName.push(node.parent.nodeInfo.describe);
      this.getFullTitle(node.parent);
    }
  };

  /**
   * 向上寻找 comment
   */
  private findComment = (node: CommentNode): undefined | {[key: string]: any[]} => {
    if (node.comment) {
      return node.comment;
    }

    if (node.parent) {
      return this.findComment(node.parent);
    }

    return undefined;
  };

  parser(source: CommentNode, func?: (nodes: CommentNode[]) => any): CommentParser {
    this.source = source;

    const queue = [this.source];

    while (queue.length !== 0) {
      const item = queue.shift();
      if (!item || !item.children) {
        continue;
      }

      for (const child of item.children) {
        // 挂载必要信息
        if (item.fullFile && !child.fullFile) {
          child.fullFile = item.fullFile;
        }
        // 挂载前继节点
        child.parent = item;

        if (child.nodeInfo && child.nodeInfo.callee && child.nodeInfo.callee === 'it') {
          this.nodes.push(child);
        }

        queue.push(child);
      }
    }

    if (typeof func === 'function') {
      func.call(this, this.nodes);
    }

    return this;
  }

  check(func: (d: {[key: string]: NameMapItem}) => any): CommentParser {
    for (const item of this.nodes) {
      // 得到注解
      const comment = this.findComment(item);
      // 注解必须存在
      if (!comment) {
        throw new Error('Test case must have annotation');
      }

      if (!item.nodeInfo) {
        throw new Error('NodeInfo case must have annotation');
      }
      // 得到 fulltitle
      this.fullName = [item.nodeInfo.describe];
      this.getFullTitle(item);

      this.fullNameMap[`${item.fullFile} ${this.fullName.reverse().join(' ')}`] = {
        comment,
        nodeInfo: item.nodeInfo,
      };

      for (const item of this.annotation.checkOutFields) {
        if (comment[item[0].slice(1)] === undefined && item[1] === 1) {
          throw new Error(`Comment must have ${item[0].slice(1)}`);
        }
      }
    }

    if (typeof func === 'function') {
      func.call(this, this.fullNameMap);
    }

    return this;
  }
}
