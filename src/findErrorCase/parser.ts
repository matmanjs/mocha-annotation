import {CommentNode} from './commentParser';

/**
 * 基础 parser 类, 读文件
 */
export class Parser {
  path: string;
  encoding: string;
  nodes: CommentNode[];
  map: Map<string, {fullTitle: string}>;

  constructor(path: string, encoding: 'utf8' = 'utf8') {
    this.path = path;
    this.encoding = encoding;
    this.nodes = [];
    this.map = new Map();
  }

  clear(): void {
    this.nodes = [];
    this.map.clear();
  }
}
