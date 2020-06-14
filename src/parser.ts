import fs from 'fs-extra';
import {AstBuilder} from './astBuilder';
import {ProcessAST, MapNode} from './processAST';
import {Annotation, CheckOutFields, TreeNode} from './annotation';
import {CommentParser} from './findErrorCase/commentParser';
import {MochaParser} from './findErrorCase/mochaParser';

export class Parse {
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
    this.mochaParser = new MochaParser(`${path}/mochawesome.json`);
  }

  /**
   * 处理源文件路径参数, 编码等
   * @param {*} sourceFiles
   * @param {*} encoding
   */
  parse(sourceFiles: string[], encoding?: string): void {
    encoding = encoding || 'utf8';

    const res: TreeNode = {children: []};
    let filename = '';
    let sourceCode = '';
    let sourceFile;

    if (typeof sourceFiles === 'string') {
      sourceFiles = [sourceFiles];
    }

    console.log('Parsing source files: %j', sourceFiles);

    for (let i = 0, l = sourceFiles.length; i < l; i++) {
      sourceCode = '';
      sourceFile = sourceFiles[i];

      filename = sourceFile;
      try {
        sourceCode = fs.readFileSync(filename, encoding as 'utf8');
      } catch (err) {
        console.error(`Unable to read and parse the source file ${filename}: ${err}`);
      }

      if (sourceCode.length && res.children !== undefined) {
        res.children.push({
          ...this.parseSourceCode(sourceCode, filename),
          filename,
        });
      }
    }

    this.store(`${this.path}/annoation.json`, res);
    console.log('Finished parsing source files.');

    this.checkComment(res);
    this.getMochaRes();
    this.resByCase();
    this.resByUser();
  }

  /**
   * 处理单个文件
   * @param {*} sourceCode
   * @param {*} sourceName
   */
  private parseSourceCode(sourceCode: string, sourceName: string) {
    console.log(`Parsing ${sourceName} ...`);

    const ast = this.astBuilder.build(sourceCode, sourceName);
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
      const author = this.commentRes[item].comment.author.join('');
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
