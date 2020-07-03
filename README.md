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
            "uuid": "267d1bc4-3c65-4710-ba87-7d471845c927",
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
                        "prelayer": "267d1bc4-3c65-4710-ba87-7d471845c927"
                    },
                    "uuid": "42f9e2e4-524d-4b79-b8cb-f752dddab5c7",
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
                                "prelayer": "42f9e2e4-524d-4b79-b8cb-f752dddab5c7"
                            },
                            "uuid": "232e201b-eec3-4967-bd9a-3e710f31b75b",
                            "children": [],
                            "fullFile": "/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js",
                            "parentId": "42f9e2e4-524d-4b79-b8cb-f752dddab5c7"
                        }
                    ],
                    "fullFile": "/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js",
                    "parentId": "267d1bc4-3c65-4710-ba87-7d471845c927"
                }
            ],
            "comment": {}
        }
    ]
}
```

### 2.2 getTestResultMap(mochaTestTreeNode, opts)

获得测试结果，一个扁平化的数据字典，`key` 为测试用例的描述，也即 `fullTitle` 。可以借助 [mochawesome](https://www.npmjs.com/package/mochawesome) 生成的 `mochawesome.json`，获得最终测试结果的结果。

- `mochaTestTreeNode`，`MochaTestTreeNode`，要解析的测试文件的列表
- `opts`，`Object`，额外参数
  - `opts.fullTitleSep`，`String`，组合 `fullTitle` 是需要的间隔符号，默认情况下该值会由用例数中的描述组合而成，组合间隔符默认为空格
  - `opts.mochawesomeJsonFile`，`String`，[mochawesome](https://www.npmjs.com/package/mochawesome) 生成的 `mochawesome.json` 路径


> `fullTitle` 参考 mochawesome.json 中的定义方式，即从 suit 到 test 的 title 值拼接起来，中间用 `fullTitleSep` 分割

```json
{
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
            "prelayer": "42f9e2e4-524d-4b79-b8cb-f752dddab5c7"
        },
        "uuid": "232e201b-eec3-4967-bd9a-3e710f31b75b",
        "children": [],
        "fullFile": "/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js",
        "parentId": "42f9e2e4-524d-4b79-b8cb-f752dddab5c7",
        "fullTitle": "/Users/helinjiang/gitprojects/mocha-annotation/test/data/mocha-examples/one-describe-one-it.test.js 一个 describe 和一个 it 1 等于 1",
        "result": {
            "title": "1 等于 1",
            "fullTitle": "一个 describe 和一个 it 1 等于 1",
            "timedOut": false,
            "duration": 0,
            "state": "passed",
            "speed": "fast",
            "pass": true,
            "fail": false,
            "pending": false,
            "context": null,
            "code": "expect(1).to.equal(1);",
            "err": {},
            "uuid": "43f91ee7-b9ac-4cbc-bd35-8d38b0fef5fb",
            "parentUUID": "4a52b6a5-5b59-4bf9-83ce-187e5d099b82",
            "isHook": false,
            "skipped": false
        }
    }
}
```