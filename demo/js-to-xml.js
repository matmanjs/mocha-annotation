// Node
const {toXML} = require('jstoxml');

console.log(
  toXML({
    testsuites: {
      testsuite: [
        {
          testcase: {
            _attrs: {
              CaseResult: '1',
              CaseManager: 'ponyma',
              CaseType: '5',
              CaseDesc: 'test sum',
              ClassName: 'test sum',
              DeviceID: 'chrome',
              ExecuteTime: '0.001',
              MethodName: 'add',
              FtName: '',
              ModuleName: '/test/unit/sum.spec.ts',
              StackTrace: '',
            },
          },
        },
        {
          testcase: {
            _attrs: {
              CaseResult: '1',
              CaseManager: 'ponyma',
              CaseType: '5',
              CaseDesc: 'test sum',
              ClassName: 'test sum',
              DeviceID: 'chrome',
              ExecuteTime: '0.001',
              MethodName: 'add',
              FtName: '',
              ModuleName: '/test/unit/sum.spec.ts',
              StackTrace: '',
            },
          },
        },
      ],
    },
  }),
);

/*
<testsuites>
    <testsuite>
        <testcase CaseResult="1" CaseManager="ponyma" CaseType="5" CaseDesc="test sum" ClassName="test sum"
                  DeviceID="chrome" ExecuteTime="0.001" MethodName="add" FtName="" ModuleName="/test/unit/sum.spec.ts"
                  StackTrace=""/>
    </testsuite>
</testsuites>
*/
