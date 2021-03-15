# value-check

功能：不同类型参数校验

## 1.校验类型分类

| 类型       | 内容                                                         |
| :--------- | ------------------------------------------------------------ |
| 基础类型   | IS_OPTIONAL、IS_NULL、IS_BOOLEAN、IS_INT、IS_FLOAT、IS_STRING、IS_ARRAY、IS_OBJECT |
| 高级类型   | IS_INT_POSITIVE_0、IS_INT_ID、IS_FLOAT_POSITIVE、IS_STRING_BASE64、IS_STRING_JSON、IS_STRING_MD5、IS_STRING_DATE、IS_STRING_DATETIME、IS_STRING_LENGTH、IS_STRING_MATCH_REGEX、IS_IN_ARRAY、IS_ARRAY_SUBSET、IS_ARRAY_LENGTH、IS_OBJECT_RULE |
| 可扩展类型 | IS_DYNAMIC                                                   |

## 2.使用方法

### 2.1 基础类型使用

```
// 以 IS_BOOLEAN 校验为例

// 导入 Check 方法
import {Check, CheckData, CheckRules} from "../../src";

const check = new Check();
const data: CheckData[] = [];
data.push({
    rule: CheckRules.IS_BOOLEAN,
    value: true
});
await check.check(data)	
```

### 2.2高级类型使用

```
// 以 IS_IN_ARRAY 校验为例

// 导入 Check 方法
import {Check, CheckData, CheckRules} from "../../src";

const check = new Check();
const data: CheckData[] = [];
data.push({
    rule: CheckRules.inArray([1, 2, 3, 4]),
    value: '1'
})

await check.check(data)
```

### 2.3可扩展类型使用

```
// 以 IS_DYNAMIC 校验为例

// 导入 Check 方法
import {Check, CheckData, CheckRules} from "../../src";

const check = new Check();
const data: CheckData[] = [];
data.push(
	{
		rule: CheckRules.inArray(['a', 'b', 'c']),
        value: 'b'
    },
    {
        rule: CheckRules.IS_BOOLEAN,
        value: false
    },
    {
        rule: CheckRules.dynamic(0, {
          a: CheckRules.IS_INT,
          b: CheckRules.IS_STRING,
          c: CheckRules.IS_FLOAT
		}),
        value: 'abc'
    }
)
await check.check(data)
```