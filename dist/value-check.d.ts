
export declare class Check {
    private static globalRules;
    static setGlobalRules(rules: ICheckRuleAlias): void;
    protected rules: Map<string, ICheckRule>;
    constructor();
    setRule(name: string, rule: ICheckRule): void;
    check(data: CheckData[]): Promise<ICheckResult>;
    static process(rule: ICheckRuleBase, value: ITypeBase, recursion?: boolean): Promise<boolean>;
    static checkInt(value: ITypeBase, action?: string): Promise<boolean>;
    static checkFloat(value: ITypeBase, action?: string): Promise<boolean>;
    static checkString(value: ITypeBase, action?: string, warp?: number): Promise<boolean>;
    static checkArray(value: ITypeBase, action?: string, warp?: number): Promise<boolean>;
}

export declare type CheckData = {
    rule: ICheckRuleAliasName | ICheckRule;
    value: ITypeBase | ITypeObject;
};

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
    static inEnum(e: unknown[] | Record<string, ICheckRuleBaseType> | Record<number, ICheckRuleBaseType>): string;
    static stringPregMatch(e: RegExp): string;
}

export declare type ICheckResult = ICheckResultBase | ICheckResultObject;

export declare type ICheckResultBase = Record<string, boolean>;

export declare type ICheckResultObject = Record<string, Record<string, boolean>>;

export declare type ICheckRule = ICheckRuleBase | ICheckRuleObject;

export declare type ICheckRuleAlias = Record<ICheckRuleAliasName, ICheckRule>;

export declare type ICheckRuleAliasName = string;

export declare type ICheckRuleBase = string;

export declare type ICheckRuleBaseType = string | number | null;

export declare type ICheckRuleObject = Record<string, ICheckRuleBase>;

declare type ITypeBase = string | number | null | [];

declare type ITypeObject = Record<string, ITypeBase>;

export declare const parseCheck: (result: ICheckResult) => boolean;

export { }
