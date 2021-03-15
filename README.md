# value-check

功能：不同类型参数校验

## 1.校验类型分类

|            |                                                              |
| ---------- | ------------------------------------------------------------ |
| 基础类型   | IS_OPTIONAL<br>IS_NULL<br>IS_BOOLEAN<br>IS_INT<br>IS_FLOAT<br>IS_STRING<br>IS_ARRAY<br>IS_OBJECT |
| 高级类型   | IS_INT_POSITIVE_0<br>IS_INT_ID<br>IS_FLOAT_POSITIVE<br>IS_STRING_BASE64<br>IS_STRING_JSON<br>IS_STRING_MD5<br>IS_STRING_DATE<br>IS_STRING_DATETIME<br>IS_STRING_LENGTH<br>IS_STRING_MATCH_REGEX<br>IS_IN_ARRAY<br>IS_ARRAY_SUBSET<br>IS_ARRAY_LENGTH<br>IS_OBJECT_RULE |
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
await check.check(data);
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

await check.check(data);
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
);
await check.check(data);
```