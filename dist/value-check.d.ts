
export declare class Check {
    private static globalRules;
    static setGlobalRules(rules: CheckRuleAlias): void;
    protected rules: Map<string, CheckRule>;
    constructor();
    setRule(name: string, rule: CheckRule): void;
    check(data: CheckData[]): Promise<CheckResult>;
    static process(rule: CheckRuleBase, value: TypeBase, recursion?: boolean): Promise<boolean>;
    static checkInt(value: TypeBase, action?: string): Promise<boolean>;
    static checkFloat(value: TypeBase, action?: string): Promise<boolean>;
    static checkString(value: TypeBase, action?: string, warp?: number): Promise<boolean>;
    static checkArray(value: TypeBase, action?: string, warp?: number): Promise<boolean>;
}

export declare type CheckData = {
    rule: CheckRuleAliasName | CheckRule;
    value: TypeBase | TypeObject;
};

export declare type CheckResult = CheckResultBase | CheckResultObject;

export declare type CheckResultBase = Record<string, boolean>;

export declare type CheckResultObject = Record<string, Record<string, boolean>>;

export declare type CheckRule = CheckRuleBase | CheckRuleObject;

export declare type CheckRuleAlias = Record<CheckRuleAliasName, CheckRule>;

export declare type CheckRuleAliasName = string;

export declare type CheckRuleBase = string;

export declare type CheckRuleBaseType = string | number | null;

export declare type CheckRuleObject = Record<string, CheckRuleBase>;

export declare class CheckRules {
    static readonly GRAMMAR: RegExp;
    static readonly OP_OPTIONAL = "o";
    static readonly OP_METHOD = "m";
    static readonly OP_NULL = "n";
    static readonly OP_BOOLEAN = "b";
    static readonly OP_INT = "i";
    static readonly OP_FLOAT = "f";
    static readonly OP_STRING = "s";
    static readonly OP_ARRAY = "a";
    static readonly IS_OPTIONAL: string;
    static readonly IS_IN_ARRAY: string;
    static readonly IS_IN_OBJECT_KEY: string;
    static readonly IS_NULL: string;
    static readonly IS_BOOLEAN: string;
    static readonly IS_INT: string;
    static readonly IS_INT_POSITIVE_0: string;
    static readonly IS_INT_ID: string;
    static readonly IS_FLOAT: string;
    static readonly IS_FLOAT_POSITIVE: string;
    static readonly IS_STRING: string;
    static readonly IS_STRING_BASE64: string;
    static readonly IS_STRING_JSON: string;
    static readonly IS_STRING_MD5: string;
    static readonly IS_STRING_DATE: string;
    static readonly IS_STRING_DATETIME: string;
    protected static readonly IS_STRING_LENGTH: string;
    protected static readonly IS_STRING_MATCH_REGEX: string;
    static readonly IS_ARRAY: string;
    protected static readonly IS_ARRAY_SUBSET: string;
    protected static readonly IS_ARRAY_CONTAINS_ALL: string;
    protected static readonly IS_ARRAY_LENGTH: string;
    protected static buffedData: unknown[];
    protected static saveBuffedData(data: unknown): number;
    static getBuffedData(index: number): unknown;
    static wrap(type: string, data: unknown): string;
    static inEnum(e: unknown[] | Record<string, CheckRuleBaseType> | Record<number, CheckRuleBaseType>): string;
    static stringPregMatch(e: RegExp): string;
}

export declare const parseCheck: (result: CheckResult) => boolean;

declare type TypeBase = string | number | null | [];

declare type TypeObject = Record<string, TypeBase>;

export { }
