import { Check, CheckRules, CheckData } from '../src'

describe('value-check base', () => {
  const check = new Check()
  it('boolean', async () => {
    const data: CheckData[] = []
    data.push({
      rule: CheckRules.IS_BOOLEAN,
      value: true
    })
    expect(await check.check(data)).toStrictEqual({
      [CheckRules.IS_BOOLEAN]: true
    })
  })
  it('boolean false', async () => {
    const data: CheckData[] = []
    data.push({
      rule: CheckRules.IS_BOOLEAN,
      value: 1
    })
    expect(await check.check(data)).toStrictEqual({
      [CheckRules.IS_BOOLEAN]: false
    })
  })

  it('null', async () => {
    const data: CheckData[] = []
    data.push({
      rule: CheckRules.IS_NULL,
      value: null
    })

    expect(await check.check(data)).toStrictEqual({
      [CheckRules.IS_NULL]: true
    })
  })

  it('null false', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_NULL,
      value: false
    }]
    expect(await check.check(data)).toStrictEqual({
      [CheckRules.IS_NULL]: false
    })
  })

  it('optional', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_OPTIONAL,
      value: undefined
    }]
    expect(await check.check(data)).toStrictEqual({
      [CheckRules.IS_OPTIONAL]: true
    })
  })
  it('optional true', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_OPTIONAL,
      value: null
    }]
    expect(await check.check(data)).toStrictEqual({
      [CheckRules.IS_OPTIONAL]: true
    })
  })

  it('string', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_STRING,
      value: 'abc'
    }]
    expect(await check.check(data)).toStrictEqual({
      [CheckRules.IS_STRING]: true
    })
  })

  it('string false', async () => {
    const data: CheckData[] = [{
      rule: CheckRules.IS_STRING,
      value: 123
    }]
    expect(await check.check(data)).toStrictEqual({
      [CheckRules.IS_STRING]: false
    })
  })
})
