import { Check, CheckRuleAlias } from './check'
import { CheckRules } from './rules'

export const extRules: CheckRuleAlias = {
  username: CheckRules.stringPregMatch(/^[a-zA-Z0-9u4E00-u9FA5][a-zA-Z0-9u4E00-u9FA5\-_]{3,31}$/),
  password: CheckRules.stringPregMatch(/^[a-zA-Z0-9\-`~!@#%$^&*()_+=[\]{};':",.<>]{4,64}$/),
  mobile: CheckRules.stringPregMatch(/^1[3456789]\d{11}$/),
  smsCode: CheckRules.stringPregMatch(/^\d{4}|\d{6}$/)
}

Check.setGlobalRules(extRules)
