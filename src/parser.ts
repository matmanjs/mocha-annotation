import fs from 'fs-extra';
import {AstBuilder} from './astBuilder';
import {MapNode, ProcessAST} from './processAST';
import {Annotation, CheckOutFields} from './annotation';
import {CommentParser} from './findErrorCase/commentParser';
import {MochaParser} from './findErrorCase/mochaParser';
import {MochaTestTreeNode} from './types';

interface getParseResultOpts {
  // 读取文件时需要的文件编码格式，默认为 utf8
  encoding?: string;

  // 是否启用继承
  isInherit?: boolean;
}

export class Parser {
  private path: string;
  private astBuilder: AstBuilder;
  private processAST: ProcessAST;
  private annotation: Annotation;
  private commentParser: CommentParser;
  private mochaParser: MochaParser;
  private commentRes: any;
  private mochaRes: any;

  constructor(path = './test', e: CheckOutFields = []) {
    this.path = path;
    this.astBuilder = new AstBuilder();
    this.processAST = new ProcessAST();
    this.annotation = new Annotation(e);
    this.commentParser = new CommentParser(this.annotation);
    // this.mochaParser = new MochaParser(`${path}/mochawesome.json`);
    this.mochaParser = new MochaParser(
      '/Users/helinjiang/gitprojects/mocha-annotation/test/data/.test_output/mochawesome.json',
    );
  }

  /**
   * 获取解析结果
   *
   * @param {String | String[]} sourceFiles 源文件绝对路径数组
   * @param {getParseResultOpts} [opts] 读取文件时需要的文件编码格式，默认为 utf8
   * @param {String} [opts.encoding] 读取文件时需要的文件编码格式，默认为 utf8
   * @param {Boolean} [opts.isInherit] 是否启用继承注解的方式
   * @return {MochaTestTreeNode}
   */
  getParseResult(sourceFiles: string | string[], opts?: getParseResultOpts): MochaTestTreeNode {
    function handleInherit(nodeInfo: MochaTestTreeNode) {
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

    // 设置默认值 utf8
    const encoding = (opts && opts.encoding) || 'utf8';

    // sourceFiles 可能为单个文件，将其统一转为数组处理
    if (typeof sourceFiles === 'string') {
      sourceFiles = [sourceFiles];
    }

    // console.log('Parsing source files:', sourceFiles);

    const res: MochaTestTreeNode = {children: []};

    for (let i = 0, l = sourceFiles.length; i < l; i++) {
      let sourceCode = '';
      const sourceFile = sourceFiles[i];

      try {
        sourceCode = fs.readFileSync(sourceFile, encoding as 'utf8');
      } catch (err) {
        console.error(`fs.readFileSync catch error!`, sourceFile, err);
      }

      if (sourceCode.length && Array.isArray(res.children)) {
        res.children.push({
          ...this.parseSourceCode(sourceCode, sourceFile),
          fullFile: sourceFile,
        });
      }
    }

    // 若启动继承关系，则还需要额外处理
    if (opts && opts.isInherit) {
      handleInherit(res);
    }

    return res;
  }

  /**
   * 检查 comment 并得到 名称-comment 映射结果
   * @param {*} res
   */
  // private getCommentMap(res: TreeNode) {
  //   const commentParser = new CommentParser(this.annotation)
  //
  //
  //   this.commentParser.parser(JSON.parse(JSON.stringify(res))).check(r => {
  //     this.commentRes = r;
  //     this.store(`${this.path}/map.json`, r);
  //   });
  // }

  /**
   * 处理源文件路径参数, 编码等
   * @param {String | String[]} sourceFiles 源文件绝对路径数组
   * @param {String} [encoding] 读取文件时需要的文件编码格式，默认为 utf8
   */
  parse(sourceFiles: string | string[], encoding?: string): void {
    const res: MochaTestTreeNode = this.getParseResult(sourceFiles);

    this.store(`${this.path}/annoation.json`, res);
    // console.log('Finished parsing source files.');

    this.checkComment(res);

    // if (this.path === '1') {
    this.getMochaRes();
    this.resByCase();
    this.resByUser();
    // }
  }

  /**
   * 处理单个文件
   * @param {*} sourceCode
   * @param {*} sourceFile
   */
  private parseSourceCode(sourceCode: string, sourceFile: string) {
    // console.log(`Parsing ${sourceFile} ...`);

    const ast = this.astBuilder.build(sourceCode, sourceFile);
    if (ast) {
      const res = this.processAST.recurse(ast) as Map<string, MapNode>;
      return this.annotation.run(res);
    }

    return undefined;
  }

  /**
   * 保存结果
   * @param {*} path
   * @param {*} data
   */
  private store(path: string, data: unknown): void {
    fs.writeFileSync(path, JSON.stringify(data));
  }

  /**
   * 检查 comment 并得到 名称-comment 映射结果
   * @param {*} res
   */
  private checkComment(res: MochaTestTreeNode) {
    this.commentParser.parser(JSON.parse(JSON.stringify(res))).check(r => {
      this.commentRes = r;
      this.store(`${this.path}/map.json`, r);
    });
  }

  /**
   * 得到 mocha parser 结果
   */
  private getMochaRes() {
    this.mochaRes = this.mochaParser.parser();
  }

  /**
   * 按照用例维度输出结果
   */
  private resByCase() {
    const resByCase: {[key: string]: any} = {};

    for (const item of Object.keys(this.commentRes)) {
      if (!this.mochaRes.get(item)) {
        continue;
      }

      resByCase[item] = {
        status: Object.keys(this.mochaRes.get(item).err).length === 0 ? 'success' : 'fail',
        comment: this.commentRes[item].comment,
        results: this.mochaRes.get(item),
      };
    }
    this.store(`${this.path}/res-by-case.json`, resByCase);
  }

  private resByUser() {
    const resByUser: {[key: string]: any} = {};

    for (const item of Object.keys(this.commentRes)) {
      const author = this.commentRes[item].comment.author;
      if (resByUser[author] === undefined) {
        resByUser[author] = [];
      }

      if (!this.mochaRes.get(item)) {
        continue;
      }

      resByUser[author].push({
        status: Object.keys(this.mochaRes.get(item).err).length === 0 ? 'success' : 'fail',
        fullTitle: item,
        comment: this.commentRes[item].comment,
        results: this.mochaRes.get(item),
      });
    }

    this.store(`${this.path}/res-by-user.json`, resByUser);
  }
}
