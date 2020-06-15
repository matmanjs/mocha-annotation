import fs from 'fs-extra';
import {AstBuilder} from './astBuilder';
import {MapNode, ProcessAST} from './processAST';
import {Annotation, CheckOutFields, TreeNode} from './annotation';
import {CommentParser} from './findErrorCase/commentParser';
import {MochaParser} from './findErrorCase/mochaParser';

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
   * 获取原始的解析结果
   *
   * @param {String | String[]} sourceFiles 源文件绝对路径数组
   * @param {String} [encoding] 读取文件时需要的文件编码格式，默认为 utf8
   * @return {TreeNode}
   */
  getOriginalResult(sourceFiles: string | string[], encoding?: string): TreeNode {
    // 设置默认值 utf8
    encoding = encoding || 'utf8';

    // sourceFiles 可能为单个文件，将其统一转为数组处理
    if (typeof sourceFiles === 'string') {
      sourceFiles = [sourceFiles];
    }

    console.log('Parsing source files: %j', sourceFiles);

    const res: TreeNode = {children: []};

    for (let i = 0, l = sourceFiles.length; i < l; i++) {
      let sourceCode = '';
      let sourceFile = sourceFiles[i];

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
    const res: TreeNode = this.getOriginalResult(sourceFiles, encoding);

    this.store(`${this.path}/annoation.json`, res);
    console.log('Finished parsing source files.');

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
    console.log(`Parsing ${sourceFile} ...`);

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
  private checkComment(res: TreeNode) {
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
