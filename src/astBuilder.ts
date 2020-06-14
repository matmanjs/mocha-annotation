import {parse, ParserOptions} from '@babel/parser';
import {File} from '@babel/types';

const parserOptions: ParserOptions = {
  allowAwaitOutsideFunction: true,
  allowImportExportEverywhere: true,
  allowReturnOutsideFunction: true,
  allowSuperOutsideMethod: true,
  plugins: [
    'asyncGenerators',
    'bigInt',
    'classPrivateMethods',
    'classPrivateProperties',
    'classProperties',
    [
      'decorators',
      {
        decoratorsBeforeExport: true,
      },
    ],
    'doExpressions',
    'dynamicImport',
    'estree',
    'exportDefaultFrom',
    'exportNamespaceFrom',
    'functionBind',
    'functionSent',
    'importMeta',
    'jsx',
    'logicalAssignment',
    'nullishCoalescingOperator',
    'numericSeparator',
    'objectRestSpread',
    'optionalCatchBinding',
    'optionalChaining',
    [
      'pipelineOperator',
      {
        proposal: 'minimal',
      },
    ],
    'throwExpressions',
  ],
  ranges: true,
};

export class AstBuilder {
  /**
   * babel 调用
   * @param {*} source
   * @param {*} filename
   */
  private parse(source: string, filename: string): File {
    let ast;

    try {
      ast = parse(source, parserOptions);
    } catch (e) {
      throw new Error(`Unable to parse ${filename}: ${e.message}`);
    }

    return ast;
  }

  /**
   * 对外暴露的函数
   * @param {*} source
   * @param {*} filename
   */
  public build(source: string, filename: string): File {
    return this.parse(source, filename);
  }
}
