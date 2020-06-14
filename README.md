# mocha-annotation

解析使用 Mocha 编写的测试用例中的注解。

## 获得注解情况

获得所有的注解结果字典，key 值为测试用例的 `fullTitle`，value 为注解对象。

> `fullTitle` 参考 mochawesome.json 中的定义方式，即从 suit 到 test 的 title 值拼接起来，中间用空格分割
