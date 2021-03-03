import { CheckRules } from './rules'

type BaseType = string | number | null

export type CheckRuleBase = string
export interface CheckRuleExt {
  [key: string]: CheckRuleBase
}
export type CheckRule = CheckRuleBase | CheckRuleExt

export type CheckRuleAliasName = string
export type CheckRuleAlias = Record<CheckRuleAliasName, CheckRule>

export type CheckData = {
  rule: CheckRuleAliasName | CheckRule,
  value: BaseType | Record<string, BaseType> | BaseType[]
}

type ScopedRule = {
  [scope: string]: {
    [name: string]: CheckRule
  }
}

function genScopeTree (scope: string): string[] {
  const tmp = scope.split('/')
  tmp.unshift('')
  const ret: string[] = []
  while (tmp.length > 0) {
    ret.push(tmp.join('/'))
    ret.pop()
  }
  ret.reverse()
  return ret
}

export class Check {
  private static globalRules = new Map<string, CheckRule>()
  static setGlobalRules (rules: CheckRuleAlias): void {
    for (const key of Object.keys(rules)) {
      this.globalRules.set(key, rules[key])
    }
  }

  protected rules: ScopedRule = { '': {} }

  constructor () {
    Check.globalRules.forEach((rule, name) => {
      this.rules[''][name] = rule
    })
  }

  setRule (scope: string, name: string, rule: CheckRule): void {
    this.rules[scope][name] = rule
  }

  async check (scope: string, data: CheckData[]): Promise<number[]> {
    const alias: CheckRuleAlias = {}
    const ret: number[] = []
    for (const name of genScopeTree(scope)) {
      if (this.rules[name]) {
        Object.keys(this.rules[name]).forEach(n => {
          alias[n] = this.rules[name][n]
        })
      }
    }
    for (const item of data) {
      ret.push(await Check.do(alias, item))
    }
    return ret
  }

  private static async do (
    alias: CheckRuleAlias,
    item: CheckData
  ): Promise<number> {
    if (typeof item.value === 'string' ||
      typeof item.value === 'number' ||
      item.value === null ||
      Array.isArray(item.value)
    ) {
      if (typeof item.rule === 'string') {
        return this.process(alias, item.rule, item.value as BaseType)
      }
    } else {
      if (typeof item.rule === 'object' &&
        Object.keys(item.value as Record<string, BaseType>) ===
        Object.keys(item.rule)
      ) {
        for (const name of Object.keys(item.value)) {
          const r = await this.process(alias, item.rule[name], item.value[name])
          if (r > 0) {
            return r
          }
        }
      }
    }
    return 0
  }

  protected static async process (
    alias: CheckRuleAlias,
    rule: CheckRuleBase,
    value: BaseType | BaseType[]
  ): Promise<number> {
    if (Array.isArray(value)) {

    } else {
      const reg = new RegExp(CheckRules.GRAMMAR)
      const [_, type, action, warp] = rule.matchAll(reg).next().value
      switch (type) {
        case CheckRules.IS_IN_ARRAY:
          return 0
      }
    }
    return 0
  }
}
