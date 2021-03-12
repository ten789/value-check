import { Check, CheckRules, CheckData } from '../src'

describe('value-check base', () => {
  const check = new Check()
  it('boolean', async () => {
    const data: CheckData[] = []
    data.push({
      rule: CheckRules.IS_BOOLEAN,
      value: true
    })
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('boolean false', async () => {
    const data: CheckData[] = []
    data.push({
      rule: CheckRules.IS_BOOLEAN,
      value: 1
    })
    expect(await check.check(data)).toStrictEqual([false])
  })

  it('null', async () => {
    const data: CheckData[] = []
    data.push({
      rule: CheckRules.IS_NULL,
      value: null
    })

    expect(await check.check(data)).toStrictEqual([true])
  })

  it('null false', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_NULL,
      value: false
    }]
    expect(await check.check(data)).toStrictEqual([false])
  })

  it('optional', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_OPTIONAL,
      value: undefined
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('optional true', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_OPTIONAL,
      value: null
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('string', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_STRING,
      value: 'abc'
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('string false', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_STRING,
      value: 123
    }]
    expect(await check.check(data)).toStrictEqual([false])
  })

  it('int', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_INT,
      value: 123456
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('int false', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_INT,
      value: '123456'
    }]
    expect(await check.check(data)).toStrictEqual([false])
  })

  it('float', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_FLOAT,
      value: 123.456
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('float 0', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_FLOAT,
      value: 0
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('float false', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_FLOAT,
      value: '123.456'
    }]
    expect(await check.check(data)).toStrictEqual([false])
  })

  it('array', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_ARRAY,
      value: [1, 2, 3]
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('object', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_OBJECT,
      value: {}
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })
})

describe('value-check array', () => {
  const check = new Check()
  it('array int', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_ARRAY + CheckRules.IS_INT,
      value: [1, 2, 3]
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('array string', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_ARRAY + CheckRules.IS_STRING,
      value: ['a', 'b', 'c']
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('array string false', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_ARRAY + CheckRules.IS_STRING,
      value: ['a', 'b', 'c', 4]
    }]
    expect(await check.check(data)).toStrictEqual([false])
  })
})

describe('value-check int ext', () => {
  const check = new Check()
  it('int > 0', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_INT_ID,
      value: 123456
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('int > 0 false', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_INT_ID,
      value: 0
    }]
    expect(await check.check(data)).toStrictEqual([false])
  })

  it('int >= 0', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_INT_POSITIVE_0,
      value: 1
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('int >= 0', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_INT_POSITIVE_0,
      value: 0
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('int >= 0 false', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_INT_POSITIVE_0,
      value: -1
    }]
    expect(await check.check(data)).toStrictEqual([false])
  })
})

describe('value-check float ext', () => {
  const check = new Check()
  it('float >= 0', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_FLOAT_POSITIVE,
      value: 1
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('float >= 0', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_FLOAT_POSITIVE,
      value: 0
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('float >= 0 false', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_FLOAT_POSITIVE,
      value: -1
    }]
    expect(await check.check(data)).toStrictEqual([false])
  })
})

describe('value-check string ext', () => {
  const check = new Check()
  it('string base64', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_STRING_BASE64,
      value: 'QmFzZTY0IOWcqOe6v+e8lueggeino+eggSjmnIDlpb3nlKjnmoQgQmFzZTY0IOWcqOe6v+W3peWFtyk='
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('string base64 false', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_STRING_BASE64,
      value: 'QmFzZTY0IOWcqOe6v+e8lueggein%!@#!@#$%$#$^&%*&)(*_)(*^&%$#@!~??>[]{}:"o+eggSjmnIDlpb3nlKjnmoQgQmFzZTY0IOWcqOe6v+W3peWFtyk='
    }]
    expect(await check.check(data)).toStrictEqual([false])
  })

  it('string json', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_STRING_JSON,
      value: '{"a":1, "b": "b", "c": [], "d":{}}'
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('string json', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_STRING_JSON,
      value: '"123"'
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('string json false', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_STRING_JSON,
      value: '{"a":1, "b": b, "c": [], "d":{}}'
    }]
    expect(await check.check(data)).toStrictEqual([false])
  })

  it('string md5', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_STRING_MD5,
      value: '59fc692dd3ffd777b94f256c4e5e4393'
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('string md5 false', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_STRING_MD5,
      value: '59FC692DD3FFD777B94F256C4E5E439311'
    }]
    expect(await check.check(data)).toStrictEqual([false])
  })
  it('string md5 false', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_STRING_MD5,
      value: '59FC692DD3FFD777B94F256C4E5E439#'
    }]
    expect(await check.check(data)).toStrictEqual([false])
  })

  it('string date', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_STRING_DATE,
      value: '2020-01-01'
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('string date false', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_STRING_DATE,
      value: '2020-01-011'
    }]
    expect(await check.check(data)).toStrictEqual([false])
  })

  it('string dateTime', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_STRING_DATETIME,
      value: '2020-01-01 00:00:00'
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('string dateTime', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_STRING_DATETIME,
      value: '2020-01-01 00:00'
    }]
    expect(await check.check(data)).toStrictEqual([false])
  })

  it('string length', async () => {
    const rule = CheckRules.stringLength(32)
    const data: CheckData[] = [{
      rule: rule,
      value: '59fc692dd3ffd777b94f256c4e5e4393'
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('string regMatch', async () => {
    const rule = CheckRules.stringPregMatch(new RegExp(/^[\w]{32}$/))
    const data: CheckData[] = [{
      rule: rule,
      value: '59fc692dd3ffd777b94f256c4e5e4393'
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })
})

describe('value-check array ext', () => {
  const check = new Check()
  it('array length', async () => {
    const rule = CheckRules.arrayLength(2)
    const data: CheckData[] = [{
      rule,
      value: [1, 2]
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('array subset', async () => {
    const rule = CheckRules.arraySubset([1, 2, 3])
    const data: CheckData[] = [{
      rule,
      value: [2, 3]
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })

  it('array subset false', async () => {
    const rule = CheckRules.arraySubset([1, 2, 3])
    const data: CheckData[] = [{
      rule,
      value: [2, 3, 4]
    }]
    expect(await check.check(data)).toStrictEqual([false])
  })
})

describe('value-check object ext', () => {
  const check = new Check()
  it('object key => rule', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.object({
        a: CheckRules.IS_STRING_DATE,
        b: CheckRules.IS_ARRAY + CheckRules.IS_INT_ID
      }),
      value: {
        a: '2020-01-01',
        b: [1, 2, 3]
      }
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })
})

describe('value-check method', () => {
  const check = new Check()
  it('method inArray', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.inArray([1, 2, 3, 4]),
      value: 1
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })
  it('method inArray false', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.inArray([1, 2, 3, 4]),
      value: '1'
    }]
    expect(await check.check(data)).toStrictEqual([true])
  })
  it('method dynamic', async () => {
    const data: CheckData[] = [
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
    ]
    expect(await check.check(data)).toStrictEqual([true])
  })
})
