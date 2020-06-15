import {v4 as uuidv4} from 'uuid';
import {checkCallExpression, CallType} from './utils';
import {
  Node,
  ExpressionStatement,
  CallExpression,
  File,
  Program,
  FunctionExpression,
  BlockStatement,
} from '@babel/types';

export interface MineCallExpression extends CallExpression {
  prelayer: string;
}

export type VirtualLayer = {
  type: 'VirtualLayer';
  parent?: unknown;
};

export type MineNode = (Node & {parent?: MineNode}) | VirtualLayer;

export type MapNode = MineCallExpression | VirtualLayer;

/**
 * 打印 log 未解析的节点
 * @param {*} param0
 */
function logUnknownNodeType(node: MineNode) {
  // console.log(
  //   `Found a node with unrecognized type ${node.type}. Ignoring the node and its ` + 'descendants.',
  // );
}

/**
 * 语法解析完成后需要将 leadingComments 移动到具体的语句中
 * @param {*} source
 * @param {*} target
 */
function moveLeadingComments(source: ExpressionStatement, target: CallExpression): void {
  if (source.leadingComments) {
    const count = source.leadingComments.length;
    target.leadingComments = source.leadingComments.slice(0, count);
    source.leadingComments = source.leadingComments.slice(count);
  }
}

/**
 * 处理 babel 完成的 AST
 * 主要为提取嵌套很深的节点
 */
export class ProcessAST {
  private nodes: MineNode[];
  private fictitious: string;
  private map: Map<string, MapNode>;

  constructor() {
    this.nodes = [];
    this.fictitious = uuidv4();
    this.map = new Map<string, MapNode>([[this.fictitious, {type: 'VirtualLayer'}]]);
  }

  // 以下为节点处理方法, 又无聊又长

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private File = (node: File, parent: MineNode, uuid: string): void => {
    this.cb(node.program, node, uuid);
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private Program = (node: Program, parent: MineNode, uuid: string): void => {
    for (const bodyItem of node.body) {
      this.cb(bodyItem, node, uuid);
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private ExpressionStatement = (
    node: ExpressionStatement,
    parent: MineNode,
    uuid: string,
  ): void => {
    if (node.expression.type !== 'CallExpression') {
      return;
    }

    moveLeadingComments(node, node.expression);
    this.cb(node.expression, node, uuid);
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private CallExpression = (node: MineCallExpression, parent: MineNode, uuid: string): void => {
    let temp = uuid;
    if (checkCallExpression(node)) {
      node.prelayer = uuid;
      temp = uuidv4();
      this.map.set(temp, node);
    }

    this.cb(node.callee, node, temp);

    if (node.arguments) {
      for (const arg of node.arguments) {
        this.cb(arg, node, temp);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private Literal = (): void => {
    console.log();
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private FunctionExpression = (node: FunctionExpression, parent: MineNode, uuid: string): void => {
    if (node.id) {
      this.cb(node.id, node, uuid);
    }

    for (const param of node.params) {
      this.cb(param, node, uuid);
    }

    this.cb(node.body, node, uuid);
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private BlockStatement = (node: BlockStatement, parent: MineNode, uuid: string): void => {
    for (const bodyItem of node.body) {
      this.cb(bodyItem, node, uuid);
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private ArrowFunctionExpression = this.FunctionExpression;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private CallExpression = (node: MineCallExpression, parent: MineNode, uuid: string): void => {
    let temp = uuid;
    const judge = checkCallExpression(node);
    // 是测试用例新建一层
    if (judge !== CallType.NONE) {
      node.prelayer = uuid;
      temp = uuidv4();
      this.map.set(temp, node);
    }

    // 如果是 each 这样的函数调用不执行
    if (judge !== CallType.CALLMEM) {
      this.cb(node.callee, node, temp);
    }

    if (node.arguments) {
      for (const arg of node.arguments) {
        this.cb(arg, node, temp);
      }
    }
  };

  /**
   * 因为在这个类的声明周期中, 可能会重复 recurse 所以需要清空上一次结果
   */
  clear(): void {
    this.nodes = [];
    this.map.clear();
    this.fictitious = uuidv4();
    this.map = new Map([[this.fictitious, {type: 'VirtualLayer'}]]);
  }

  /**
   * 通过反射确定调用的方法
   * @param {*} node
   * @param {*} parent
   */
  private cb(node: MineNode, parent: MineNode | null, uuid: string) {
    node.parent = parent || null;
    this.nodes.push(node);

    const method = Reflect.get(this, node.type);
    if (!method) {
      logUnknownNodeType(node);
    } else {
      method(node, parent, uuid);
    }
  }

  /**
   * 将 ast 拍平
   * @param {*} ast
   * @param {*} visitor
   * @param {*} filename
   */
  recurse(ast: File): Map<string, MineNode> {
    this.clear();
    this.cb(ast, null, this.fictitious);

    return this.map;
  }
}
