
export type ICheckRuleBaseType = string | number | null

export class CheckRules {
  static readonly GRAMMAR = /^#(o|m|b|i|f|s|a|O)(\*.+)?(,\d+)?$/
  static readonly OP_OPTIONAL = 'o'
  static readonly OP_METHOD = 'm'
  static readonly OP_NULL = 'n'
  static readonly OP_BOOLEAN = 'b'
  static readonly OP_INT = 'i'
  static readonly OP_FLOAT = 'f'
  static readonly OP_STRING = 's'
  static readonly OP_ARRAY = 'a'

  static readonly IS_OPTIONAL = `|#${CheckRules.OP_OPTIONAL}|`

  static readonly IS_IN_ARRAY = `#${CheckRules.OP_METHOD}*inArr,$`

  static readonly IS_IN_OBJECT_KEY = `${CheckRules.OP_METHOD}*inObjKey,$`

  static readonly IS_NULL = `|${CheckRules.OP_NULL}|`

  static readonly IS_BOOLEAN = `|#${CheckRules.OP_BOOLEAN}|`

  static readonly IS_INT = `|#${CheckRules.OP_INT}|`
  static readonly IS_INT_POSITIVE_0 = `|#${CheckRules.OP_INT}*>=0|`
  static readonly IS_INT_ID = `|#${CheckRules.OP_INT}*>0|`

  static readonly IS_FLOAT = `|#${CheckRules.OP_FLOAT}|`
  static readonly IS_FLOAT_POSITIVE = `|#${CheckRules.OP_FLOAT}*>=0|`

  static readonly IS_STRING = `|#${CheckRules.OP_STRING}|`
  static readonly IS_STRING_BASE64 = `|#${CheckRules.OP_STRING}*64|`
  static readonly IS_STRING_JSON = `|#${CheckRules.OP_STRING}*json|`
  static readonly IS_STRING_MD5 = `|#${CheckRules.OP_STRING}*md5|`
  static readonly IS_STRING_DATE = `|#${CheckRules.OP_STRING}*d|`
  static readonly IS_STRING_DATETIME = `|#${CheckRules.OP_STRING}*dt|`
  protected static readonly IS_STRING_LENGTH = `|#${CheckRules.OP_STRING}*len,$|`
  protected static readonly IS_STRING_MATCH_REGEX = `|#${CheckRules.OP_STRING}*regex,$|`

  static readonly IS_ARRAY = `|#${CheckRules.OP_ARRAY}|`
  protected static readonly IS_ARRAY_SUBSET = `|#${CheckRules.OP_ARRAY}*sub,$|`
  protected static readonly IS_ARRAY_CONTAINS_ALL = `|#${CheckRules.OP_ARRAY}*cont,$|`
  protected static readonly IS_ARRAY_LENGTH = `|#${CheckRules.OP_ARRAY}*len,$|`

  // 占位 方便 index 快速非空判断
  protected static buffedData: unknown[] = [null]
  protected static saveBuffedData (data: unknown): number {
    this.buffedData.push(data)
    return this.buffedData.length
  }

  static getBuffedData (index: number): unknown {
    return this.buffedData[index]
  }

  static wrap (type: string, data: unknown): string {
    const id = this.saveBuffedData(data)
    return type.replace('$', id.toString())
  }

  static inEnum (
    e: unknown[] | Record<string, ICheckRuleBaseType> | Record<number, ICheckRuleBaseType>
  ): string {
    const w = Array.isArray(e) ? e : Object.keys(e).map(k => (e as any)[k])
    return this.wrap(this.IS_IN_ARRAY, w)
  }

  static stringPregMatch (e: RegExp): string {
    return this.wrap(this.IS_STRING_MATCH_REGEX, e)
  }
}
