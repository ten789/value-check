import { CheckRules } from './rules'

type ITypeBase = string | number | null | boolean | undefined
type ITypeArray = ITypeBase[]
type ITypeObject = Record<string, ITypeBase | ITypeArray>
export type ICheckType = ITypeBase | ITypeArray | ITypeObject

// 单行能表示的规则
export type ICheckRule = string

export type ICheckRuleAliasName = string
export type ICheckRuleAlias = Record<ICheckRuleAliasName, ICheckRule>

export type CheckData = {
  rule: ICheckRuleAliasName | ICheckRule,
  value: ICheckType
}

export type ICheckResultBase = boolean
export type ICheckResult = boolean[]

export class Check {
  private static globalRules = new Map<string, ICheckRule>()
  static setGlobalRules (rules: ICheckRuleAlias): void {
    for (const key of Object.keys(rules)) {
      this.globalRules.set(key, rules[key])
    }
  }

  protected rules = new Map<string, ICheckRule>()

  setRule (name: string, rule: ICheckRule): void {
    this.rules.set(name, rule)
  }

  async check (data: CheckData[]): Promise<ICheckResult> {
    const ret: ICheckResult = []
    for (const item of data) {
      const r = await Check.process(item.rule, item.value as ITypeBase, data)
      ret.push(r)
    }
    return ret
  }

  static async process (
    rule: ICheckRule,
    value: ICheckType,
    checkData: CheckData[]
  ): Promise<ICheckResultBase> {
    const rules = rule.split('|').filter(Boolean)
    const regExp = new RegExp(CheckRules.GRAMMAR)

    let newRule: ICheckRule
    // eslint-disable-next-line no-unreachable-loop
    for (let index = 0; index < rules.length; index++) {
      const r = rules[index]
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
          if (!await this.checkArray(value, action, parseInt(warp)) ||
            !Array.isArray(value)
          ) {
            return false
          }
          newRule = rules.slice(index + 1).join('|')
          for (const v of value) {
            if (!await this.process(newRule, v, checkData)) {
              return false
            }
          }
          return true
        case CheckRules.OP_OBJECT:
          if (!await this.checkObject(value, action, parseInt(warp), checkData)) {
            return false
          }
      }
    }
    return true
  }

  static async checkInt (
    value: ICheckType,
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
    value: ICheckType,
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
    value: ICheckType,
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
          return !!JSON.parse(value)
        } catch {
          return false
        }
      case 'md5':
        return (value.length === 32 || value.length === 16) && /^[a-zA-Z0-9]+$/.test(value)
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
    value: ICheckType,
    action?: string,
    warp?: number
  ): Promise<boolean> {
    if (!Array.isArray(value)) {
      return false
    }
    switch (action) {
      case 'len':
        return !!warp && value.length === CheckRules.getBuffedData(warp)
      case 'subset':
        if (warp) {
          const data = CheckRules.getBuffedData(warp)
          return Array.isArray(data) &&
            value.filter(v => data.indexOf(v) > -1).length === value.length
        } else {
          return false
        }
      default:
        return true
    }
  }

  static async checkObject (
    value: ICheckType,
    action: string | undefined,
    wrap: number | undefined,
    checkData: CheckData[]
  ): Promise<boolean> {
    if (typeof value !== 'object' || Array.isArray(value) || value === null) {
      return false
    }
    if (action === 'rule') {
      if (!wrap) {
        return false
      }
      const data = CheckRules.getBuffedData(wrap) as Record<string, ICheckRule>
      if (typeof data !== 'object') {
        return false
      }
      for (const key of Reflect.ownKeys(data)) {
        if (!Reflect.has(value, key)) {
          return false
        }
        const r = Reflect.get(data, key) as ICheckRule
        if (!await this.process(r, Reflect.get(value, key), checkData)) {
          return false
        }
      }
      return true
    } else {
      return true
    }
  }
}
