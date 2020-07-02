# mocha-annotation

解析使用 Mocha 编写的测试用例中的注解。


## 1. 安装

```
$ npm install mocha-annotation --save
```

## 2. API

### 2.1 getParseResult(sourceFiles, opts)

获得注解解析结果，结果为一个对象。

- `sourceFiles`，`string[]`，要解析的测试文件的列表
- `opts`，`Object`，额外参数
  - `opts.encoding`，`string`，读取文件时需要的文件编码格式，默认为 `utf8`
  - `opts.isInherit`，`boolean`，是否启用继承注解的方式，如果设置为 `true`，则会按照用例组织的方式，优先使用自己的注解，其他则继承父级的注解


例如测试用例代码：

```js
const {expect} = require('chai');

/**
 * @author matmanjs
 * @description hello,world!
 * @other one-describe-one-it.test.js
 * @testid one-describe-one-it:describe1
 */
describe('一个 describe 和一个 it', function () {
  /**
   * @testid one-describe-one-it:describe1:it1
   */
  it('1 等于 1', function () {
    expect(1).to.equal(1);
  });
});
```

解析的结果为：

```json
{
    "children": [
        {
            "fullFile": "/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js",
            "uuid": "f8d25bd4-4c89-41a9-93a1-fd20a5367067",
            "children": [
                {
                    "comment": {
                        "author": "matmanjs",
                        "description": "hello,world!",
                        "other": "one-describe-one-it.test.js",
                        "testid": "one-describe-one-it:describe1"
                    },
                    "nodeInfo": {
                        "describe": "一个 describe 和一个 it",
                        "callee": "describe",
                        "prelayer": "f8d25bd4-4c89-41a9-93a1-fd20a5367067"
                    },
                    "uuid": "97b41416-7061-4810-b951-5561aa486391",
                    "children": [
                        {
                            "comment": {
                                "author": "matmanjs",
                                "description": "hello,world!",
                                "other": "one-describe-one-it.test.js",
                                "testid": "one-describe-one-it:describe1:it1"
                            },
                            "nodeInfo": {
                                "describe": "1 等于 1",
                                "callee": "it",
                                "prelayer": "97b41416-7061-4810-b951-5561aa486391"
                            },
                            "uuid": "1c87ec72-74a6-4970-b52a-fda4236437e0",
                            "children": [],
                            "fullFile": "/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js",
                            "parentId": "97b41416-7061-4810-b951-5561aa486391"
                        }
                    ],
                    "fullFile": "/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js",
                    "parentId": "f8d25bd4-4c89-41a9-93a1-fd20a5367067"
                }
            ],
            "comment": {}
        }
    ]
}
```

### 2.2 getTestCaseMap(mochaTestTreeNode, fullTitleSep)

将 `getParseResult(sourceFiles, opts)` 得到的树形结果进行处理，获得一个扁平化的数据字典，`key` 为测试用例的描述，也即 `fullTitle` 。

- `mochaTestTreeNode`，`MochaTestTreeNode`，要解析的测试文件的列表
- `fullTitleSep`，`String`，组合 `fullTitle` 是需要的间隔符号，默认情况下该值会由用例数中的描述组合而成，组合间隔符默认为空格

> `fullTitle` 参考 mochawesome.json 中的定义方式，即从 suit 到 test 的 title 值拼接起来，中间用空格分割

```json
{
    "/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js 一个 describe 和一个 it": {
        "comment": {
            "author": "matmanjs",
            "description": "hello,world!",
            "other": "one-describe-one-it.test.js",
            "testid": "one-describe-one-it:describe1"
        },
        "nodeInfo": {
            "describe": "一个 describe 和一个 it",
            "callee": "describe",
            "prelayer": "f8d25bd4-4c89-41a9-93a1-fd20a5367067"
        },
        "uuid": "97b41416-7061-4810-b951-5561aa486391",
        "children": [
            {
                "comment": {
                    "author": "matmanjs",
                    "description": "hello,world!",
                    "other": "one-describe-one-it.test.js",
                    "testid": "one-describe-one-it:describe1:it1"
                },
                "nodeInfo": {
                    "describe": "1 等于 1",
                    "callee": "it",
                    "prelayer": "97b41416-7061-4810-b951-5561aa486391"
                },
                "uuid": "1c87ec72-74a6-4970-b52a-fda4236437e0",
                "children": [],
                "fullFile": "/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js",
                "parentId": "97b41416-7061-4810-b951-5561aa486391",
                "fullTitle": "/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js 一个 describe 和一个 it 1 等于 1"
            }
        ],
        "fullFile": "/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js",
        "parentId": "f8d25bd4-4c89-41a9-93a1-fd20a5367067",
        "fullTitle": "/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js 一个 describe 和一个 it"
    },
    "/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js 一个 describe 和一个 it 1 等于 1": {
        "comment": {
            "author": "matmanjs",
            "description": "hello,world!",
            "other": "one-describe-one-it.test.js",
            "testid": "one-describe-one-it:describe1:it1"
        },
        "nodeInfo": {
            "describe": "1 等于 1",
            "callee": "it",
            "prelayer": "97b41416-7061-4810-b951-5561aa486391"
        },
        "uuid": "1c87ec72-74a6-4970-b52a-fda4236437e0",
        "children": [],
        "fullFile": "/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js",
        "parentId": "97b41416-7061-4810-b951-5561aa486391",
        "fullTitle": "/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js 一个 describe 和一个 it 1 等于 1"
    }
}
```

### 2.3 getTestResultMap(mochaTestTreeNode, mochawesomeJsonFile)

借助 [mochawesome](https://www.npmjs.com/package/mochawesome) 生成的 `mochawesome.json`，获得最终测试结果的结果。

- `mochaTestTreeNode`，`MochaTestTreeNode`，要解析的测试文件的列表
- `mochawesomeJsonFile`，`String`，[mochawesome](https://www.npmjs.com/package/mochawesome) 生成的 `mochawesome.json` 路径
