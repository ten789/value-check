import { CheckRules } from './rules'

type ITypeBase = string | number | null | boolean | undefined | []
type ITypeObject = Record<string, ITypeBase>

// 单行能表示的规则
export type ICheckRuleBase = string
// Object类型的规则
export type ICheckRuleObject = Record<string, ICheckRuleBase>
export type ICheckRule = ICheckRuleBase | ICheckRuleObject

export type ICheckRuleAliasName = string
export type ICheckRuleAlias = Record<ICheckRuleAliasName, ICheckRule>

export type CheckData = {
  rule: ICheckRuleAliasName | ICheckRule,
  value: ITypeBase | ITypeObject
}

export type ICheckResultBase = Record<string, boolean>
export type ICheckResultObject = Record<string, Record<string, boolean>>
export type ICheckResult = ICheckResultBase | ICheckResultObject

export const parseCheck = function (result: ICheckResult): boolean {
  for (const key of Object.keys(result)) {
    if (typeof result[key] === 'object') {
      if (!parseCheck(result[key] as ICheckResult)) {
        return false
      }
    } else {
      if (!result[key]) {
        return false
      }
    }
  }
  return true
}

export class Check {
  private static globalRules = new Map<string, ICheckRule>()
  static setGlobalRules (rules: ICheckRuleAlias): void {
    for (const key of Object.keys(rules)) {
      this.globalRules.set(key, rules[key])
    }
  }

  protected rules = new Map<string, ICheckRule>()

  constructor () {
    Check.globalRules.forEach((rule, name) => {
      this.rules.set(name, rule)
    })
  }

  setRule (name: string, rule: ICheckRule): void {
    this.rules.set(name, rule)
  }

  async check (data: CheckData[]): Promise<ICheckResult> {
    const ret: ICheckResult = {}
    let objectIndex = 0
    for (const item of data) {
      if (typeof item.value === 'string' ||
        typeof item.value === 'number' ||
        typeof item.value === 'boolean' ||
        typeof item.value === 'undefined' ||
        item.value === null ||
        Array.isArray(item.value)
      ) {
        if (typeof item.rule === 'string') {
          ret[item.rule] = await Check.process(item.rule, item.value as ITypeBase)
        } else {
          throw new Error('Check: Rule and Value type error.')
        }
      } else {
        if (typeof item.rule === 'object' &&
          typeof item.value === 'object' &&
          Object.keys(item.value) === Object.keys(item.rule)
        ) {
          const tmp: Record<string, boolean> = {}
          for (const name of Object.keys(item.value)) {
            tmp[name] = await Check.process(item.rule[name], item.value[name])
          }
          ret[objectIndex.toString()] = tmp
          objectIndex++
        }
      }
    }
    return ret
  }

  static async process (
    rule: ICheckRuleBase,
    value: ITypeBase,
    recursion = true
  ): Promise<boolean> {
    const rules = rule.split('|').filter(Boolean)
    const regExp = new RegExp(CheckRules.GRAMMAR)

    // eslint-disable-next-line no-unreachable-loop
    for (const r of rules) {
      const [_n, op, action, warp] = r.matchAll(regExp)
        .next()
        .value as string[]
      switch (op) {
        case CheckRules.OP_OPTIONAL:
          if (typeof value === 'undefined') {
            return true
          }
          break
        case CheckRules.OP_NULL:
          return value === null
        case CheckRules.OP_BOOLEAN:
          return value === true || value === false
        case CheckRules.OP_INT:
          if (!await this.checkInt(value, action)) {
            return false
          }
          break
        case CheckRules.OP_FLOAT:
          return await this.checkFloat(value, action)
        case CheckRules.OP_STRING:
          return await this.checkString(value, action, parseInt(warp))
        case CheckRules.OP_ARRAY:
          if (!await this.checkArray(value, action, parseInt(warp))) {
            return false
          }
          break
      }
    }
    return true
  }

  static async checkInt (
    value: ITypeBase,
    action?: string
  ): Promise<boolean> {
    if (!(typeof value === 'number' && parseInt(value.toString()) === value)) {
      return false
    }
    switch (action) {
      case '>=0':
        return value >= 0
      case '>0':
        return value > 0
      default:
        return true
    }
  }

  static async checkFloat (
    value: ITypeBase,
    action?: string
  ): Promise<boolean> {
    if (!(typeof value === 'number' && parseFloat(value.toString()) === value)) {
      return false
    }
    switch (action) {
      case '>=0':
        return value >= 0
      default:
        return true
    }
  }

  static async checkString (
    value: ITypeBase,
    action?: string,
    warp?: number
  ): Promise<boolean> {
    if (typeof value !== 'string') {
      return false
    }
    switch (action) {
      case '64':
        return /^[\w+=]*$/.test(value)
      case 'json':
        return !!JSON.parse(value)
      case 'md5':
        return /^[a-z0-9]{16}|[a-z0-9]{32}$/.test(value)
      case 'd':
        return /^\d{1,4}-\d{1,2}-\d{1,2}$/.test(value)
      case 'dt':
        return /^\d{1,4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/.test(value)
      case 'len':
        return !!warp && value.length === CheckRules.getBuffedData(warp)
      case 'regex':
        return !!warp && new RegExp(CheckRules.getBuffedData(warp) as string)
          .test(value)
      default:
        return true
    }
  }

  static async checkArray (
    value: ITypeBase,
    action?: string,
    warp?: number
  ): Promise<boolean> {
    if (!Array.isArray(value)) {
      return false
    }
    switch (action) {
      case 'len':
        return !!warp && value.length === CheckRules.getBuffedData(warp)
      default:
        return true
    }
  }
}
