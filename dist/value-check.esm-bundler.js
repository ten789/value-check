class CheckRules {
    static saveBuffedData(data) {
        this.buffedData.push(data);
        return this.buffedData.length;
    }
    static getBuffedData(index) {
        return this.buffedData[index];
    }
    static wrap(type, data) {
        const id = this.saveBuffedData(data);
        return type.replace('$', id.toString());
    }
    static inEnum(e) {
        const w = Array.isArray(e) ? e : Object.keys(e).map(k => e[k]);
        return this.wrap(this.IS_IN_ARRAY, w);
    }
    static stringPregMatch(e) {
        return this.wrap(this.IS_STRING_MATCH_REGEX, e);
    }
}
CheckRules.GRAMMAR = /^#(o|m|b|i|f|s|a|O)(\*.+)?(,\d+)?$/;
CheckRules.OP_OPTIONAL = 'o';
CheckRules.OP_METHOD = 'm';
CheckRules.OP_NULL = 'n';
CheckRules.OP_BOOLEAN = 'b';
CheckRules.OP_INT = 'i';
CheckRules.OP_FLOAT = 'f';
CheckRules.OP_STRING = 's';
CheckRules.OP_ARRAY = 'a';
CheckRules.IS_OPTIONAL = `|#${CheckRules.OP_OPTIONAL}|`;
CheckRules.IS_IN_ARRAY = `#${CheckRules.OP_METHOD}*inArr,$`;
CheckRules.IS_IN_OBJECT_KEY = `${CheckRules.OP_METHOD}*inObjKey,$`;
CheckRules.IS_NULL = `|${CheckRules.OP_NULL}|`;
CheckRules.IS_BOOLEAN = `|#${CheckRules.OP_BOOLEAN}|`;
CheckRules.IS_INT = `|#${CheckRules.OP_INT}|`;
CheckRules.IS_INT_POSITIVE_0 = `|#${CheckRules.OP_INT}*>=0|`;
CheckRules.IS_INT_ID = `|#${CheckRules.OP_INT}*>0|`;
CheckRules.IS_FLOAT = `|#${CheckRules.OP_FLOAT}|`;
CheckRules.IS_FLOAT_POSITIVE = `|#${CheckRules.OP_FLOAT}*>=0|`;
CheckRules.IS_STRING = `|#${CheckRules.OP_STRING}|`;
CheckRules.IS_STRING_BASE64 = `|#${CheckRules.OP_STRING}*64|`;
CheckRules.IS_STRING_JSON = `|#${CheckRules.OP_STRING}*json|`;
CheckRules.IS_STRING_MD5 = `|#${CheckRules.OP_STRING}*md5|`;
CheckRules.IS_STRING_DATE = `|#${CheckRules.OP_STRING}*d|`;
CheckRules.IS_STRING_DATETIME = `|#${CheckRules.OP_STRING}*dt|`;
CheckRules.IS_STRING_LENGTH = `|#${CheckRules.OP_STRING}*len,$|`;
CheckRules.IS_STRING_MATCH_REGEX = `|#${CheckRules.OP_STRING}*regex,$|`;
CheckRules.IS_ARRAY = `|#${CheckRules.OP_ARRAY}|`;
CheckRules.IS_ARRAY_SUBSET = `|#${CheckRules.OP_ARRAY}*sub,$|`;
CheckRules.IS_ARRAY_CONTAINS_ALL = `|#${CheckRules.OP_ARRAY}*cont,$|`;
CheckRules.IS_ARRAY_LENGTH = `|#${CheckRules.OP_ARRAY}*len,$|`;
// 占位 方便 index 快速非空判断
CheckRules.buffedData = [null];

class Check {
    constructor() {
        this.rules = new Map();
        Check.globalRules.forEach((rule, name) => {
            this.rules.set(name, rule);
        });
    }
    static setGlobalRules(rules) {
        for (const key of Object.keys(rules)) {
            this.globalRules.set(key, rules[key]);
        }
    }
    setRule(name, rule) {
        this.rules.set(name, rule);
    }
    async check(data) {
        const ret = {};
        let objectIndex = 0;
        for (const item of data) {
            if (typeof item.value === 'string' ||
                typeof item.value === 'number' ||
                item.value === null ||
                Array.isArray(item.value)) {
                if (typeof item.rule === 'string') {
                    ret[item.rule] = await Check.process(item.rule, item.value);
                }
                else {
                    throw new Error('Check: Rule and Value type error.');
                }
            }
            else {
                if (typeof item.rule === 'object' &&
                    typeof item.value === 'object' &&
                    Object.keys(item.value) === Object.keys(item.rule)) {
                    const tmp = {};
                    for (const name of Object.keys(item.value)) {
                        tmp[name] = await Check.process(item.rule[name], item.value[name]);
                    }
                    ret[objectIndex.toString()] = tmp;
                    objectIndex++;
                }
            }
        }
        return ret;
    }
    static async process(rule, value, recursion = true) {
        const rules = rule.split('|').filter(Boolean);
        for (const index in rules) {
            const r = rules[index];
            const [op, action, warp] = r.matchAll(CheckRules.GRAMMAR)
                .next()
                .value.slice(1);
            switch (op) {
                case CheckRules.OP_OPTIONAL:
                    if (typeof value === 'undefined') {
                        return true;
                    }
                    break;
                case CheckRules.OP_NULL:
                    if (value === null) {
                        return true;
                    }
                    break;
                case CheckRules.OP_BOOLEAN:
                    if (typeof value === 'boolean') {
                        return true;
                    }
                    break;
                case CheckRules.OP_INT:
                    if (!await this.checkInt(value, action)) {
                        return false;
                    }
                    break;
                case CheckRules.OP_FLOAT:
                    if (!await this.checkFloat(value, action)) {
                        return false;
                    }
                    break;
                case CheckRules.OP_STRING:
                    if (!await this.checkString(value, action, parseInt(warp))) {
                        return false;
                    }
                    break;
                case CheckRules.OP_ARRAY:
                    if (!recursion) {
                        return true;
                    }
                    if (!await this.checkArray(value, action, parseInt(warp))) {
                        return false;
                    }
                    for (const item of value) {
                        if (!await this.process(rule, item, false)) {
                            return false;
                        }
                    }
                    break;
            }
        }
        return true;
    }
    static async checkInt(value, action) {
        if (!(typeof value === 'number' && parseInt(value.toString()) === value)) {
            return false;
        }
        switch (action) {
            case '>=0':
                return value >= 0;
            case '>0':
                return value > 0;
            default:
                return true;
        }
    }
    static async checkFloat(value, action) {
        if (!(typeof value === 'number' && parseFloat(value.toString()) === value)) {
            return false;
        }
        switch (action) {
            case '>=0':
                return value >= 0;
            default:
                return true;
        }
    }
    static async checkString(value, action, warp) {
        if (typeof value !== 'string') {
            return false;
        }
        switch (action) {
            case '64':
                return /^[\w+=]*$/.test(value);
            case 'json':
                try {
                    JSON.parse(value);
                    return true;
                }
                catch {
                    return false;
                }
            case 'md5':
                return /^[a-z0-9]{16}|[a-z0-9]{32}$/.test(value);
            case 'd':
                return /^\d{1,4}-\d{1,2}-\d{1,2}$/.test(value);
            case 'dt':
                return /^\d{1,4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/.test(value);
            case 'len':
                return !!warp && value.length === CheckRules.getBuffedData(warp);
            case 'regex':
                try {
                    return !!warp && new RegExp(CheckRules.getBuffedData(warp))
                        .test(value);
                }
                catch {
                    return false;
                }
            default:
                return true;
        }
    }
    static async checkArray(value, action, warp) {
        if (!Array.isArray(value)) {
            return false;
        }
        switch (action) {
            case 'len':
                try {
                    return !!warp && value.length === CheckRules.getBuffedData(warp);
                }
                catch {
                    return false;
                }
            default:
                return true;
        }
    }
}
Check.globalRules = new Map();

const extRules = {
    username: CheckRules.stringPregMatch(/^[a-zA-Z0-9u4E00-u9FA5][a-zA-Z0-9u4E00-u9FA5\-_]{3,31}$/),
    password: CheckRules.stringPregMatch(/^[a-zA-Z0-9\-`~!@#%$^&*()_+=[\]{};':",.<>]{4,64}$/),
    mobile: CheckRules.stringPregMatch(/^1[3456789]\d{11}$/),
    smsCode: CheckRules.stringPregMatch(/^\d{4}|\d{6}$/)
};
Check.setGlobalRules(extRules);

export { Check, CheckRules };
//# sourceMappingURL=value-check.esm-bundler.js.map
