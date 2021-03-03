import { CheckRules } from './rules'

type TypeBase = string | number | null | []
type TypeObject = Record<string, TypeBase>

// 单行能表示的规则
export type CheckRuleBase = string
// Object类型的规则
export type CheckRuleObject = Record<string, CheckRuleBase>
export type CheckRule = CheckRuleBase | CheckRuleObject

export type CheckRuleAliasName = string
export type CheckRuleAlias = Record<CheckRuleAliasName, CheckRule>

export type CheckData = {
  rule: CheckRuleAliasName | CheckRule,
  value: TypeBase | TypeObject
}

export type CheckResultBase = Record<string, boolean>
export type CheckResultObject = Record<string, Record<string, boolean>>
export type CheckResult = CheckResultBase | CheckResultObject

export class Check {
  private static globalRules = new Map<string, CheckRule>()
  static setGlobalRules (rules: CheckRuleAlias): void {
    for (const key of Object.keys(rules)) {
      this.globalRules.set(key, rules[key])
    }
  }

  protected rules = new Map<string, CheckRule>()

  constructor () {
    Check.globalRules.forEach((rule, name) => {
      this.rules.set(name, rule)
    })
  }

  setRule (name: string, rule: CheckRule): void {
    this.rules.set(name, rule)
  }

  async check (data: CheckData[]): Promise<CheckResult> {
    const ret: CheckResult = {}
    let objectIndex = 0
    for (const item of data) {
      if (typeof item.value === 'string' ||
        typeof item.value === 'number' ||
        item.value === null ||
        Array.isArray(item.value)
      ) {
        if (typeof item.rule === 'string') {
          ret[item.rule] = await Check.process(item.rule, item.value)
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
    rule: CheckRuleBase,
    value: TypeBase,
    recursion = true
  ): Promise<boolean> {
    const rules = rule.split('|').filter(Boolean)
    for (const index in rules) {
      const r = rules[index]
      const [op, action, warp] = r.matchAll(CheckRules.GRAMMAR)
        .next()
        .value.slice(1) as string[]
      switch (op) {
        case CheckRules.OP_OPTIONAL:
          if (typeof value === 'undefined') {
            return true
          }
          break
        case CheckRules.OP_NULL:
          if (value === null) {
            return true
          }
          break
        case CheckRules.OP_BOOLEAN:
          if (typeof value === 'boolean') {
            return true
          }
          break
        case CheckRules.OP_INT:
          if (!await this.checkInt(value, action)) {
            return false
          }
          break
        case CheckRules.OP_FLOAT:
          if (!await this.checkFloat(value, action)) {
            return false
          }
          break
        case CheckRules.OP_STRING:
          if (!await this.checkString(value, action, parseInt(warp))) {
            return false
          }
          break
        case CheckRules.OP_ARRAY:
          if (!recursion) {
            return true
          }
          if (!await this.checkArray(value, action, parseInt(warp))) {
            return false
          }
          for (const item of value as TypeBase[]) {
            if (!await this.process(rule, item, false)) {
              return false
            }
          }
          break
      }
    }
    return true
  }

  static async checkInt (
    value: TypeBase,
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
    value: TypeBase,
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
    value: TypeBase,
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
        try {
          JSON.parse(value)
          return true
        } catch {
          return false
        }
      case 'md5':
        return /^[a-z0-9]{16}|[a-z0-9]{32}$/.test(value)
      case 'd':
        return /^\d{1,4}-\d{1,2}-\d{1,2}$/.test(value)
      case 'dt':
        return /^\d{1,4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/.test(value)
      case 'len':
        return !!warp && value.length === CheckRules.getBuffedData(warp)
      case 'regex':
        try {
          return !!warp && new RegExp(CheckRules.getBuffedData(warp) as string)
            .test(value)
        } catch {
          return false
        }
      default:
        return true
    }
  }

  static async checkArray (
    value: TypeBase,
    action?: string,
    warp?: number
  ): Promise<boolean> {
    if (!Array.isArray(value)) {
      return false
    }
    switch (action) {
      case 'len':
        try {
          return !!warp && value.length === CheckRules.getBuffedData(warp)
        } catch {
          return false
        }
      default:
        return true
    }
  }
}
