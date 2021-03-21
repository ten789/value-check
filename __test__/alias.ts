import { Check, CheckRules, CheckData } from '../src'

describe('value-check alias', () => {
  const check = new Check()
  it('username', async () => {
    expect(await check.check([{
      rule: 'username',
      value: 'username'
    }])).toStrictEqual([true])
  })
})

describe('value-check alias false', () => {
  const check = new Check()
  it('undefined', async () => {
    expect(await check.check([{
      rule: '11111',
      value: 1111
    }])).toStrictEqual([false])
  })
})
