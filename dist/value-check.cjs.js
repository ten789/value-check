'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class CheckRules {
    static saveBuffedData(data) {
        this.buffedData.push(data);
        return this.buffedData.length;
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
CheckRules.OP_BOOLEAN = 'b';
CheckRules.OP_INT = 'i';
CheckRules.OP_FLOAT = 'f';
CheckRules.OP_STRING = 's';
CheckRules.OP_ARRAY = 'a';
CheckRules.OP_OBJECT = 'O';
CheckRules.IS_OPTIONAL = `|#${CheckRules.OP_OPTIONAL}|`;
CheckRules.IS_IN_ARRAY = `#${CheckRules.OP_METHOD}*inArr,$`;
CheckRules.IS_IN_OBJECT_KEY = `${CheckRules.OP_METHOD}*inObjKey,$`;
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
CheckRules.IS_STRING_SPECIFIED_LEN = `|#${CheckRules.OP_STRING}*len,$|`;
CheckRules.IS_STRING_MATCH_REGEX = `|#${CheckRules.OP_STRING}*regex,$|`;
CheckRules.IS_ARRAY = `|#${CheckRules.OP_ARRAY}|`;
CheckRules.IS_ARRAY_SUBSET = `|#${CheckRules.OP_ARRAY}*sub,$|`;
CheckRules.IS_ARRAY_CONTAINS_ALL = `|#${CheckRules.OP_ARRAY}*cont,$|`;
CheckRules.IS_ARRAY_LENGTH = `|#${CheckRules.OP_ARRAY}*length,$|`;
CheckRules.IS_OBJECT = `|#${CheckRules.OP_OBJECT}|`;
CheckRules.IS_OBJECT_KEY_SUBSET = `|#${CheckRules.OP_OBJECT}*sub,$|`;
CheckRules.IS_OBJECT_KEY_CONTAINS_ALL = `|#${CheckRules.OP_OBJECT}*cont,$|`;
CheckRules.buffedData = [];

function genScopeTree(scope) {
    const tmp = scope.split('/');
    tmp.unshift('');
    const ret = [];
    while (tmp.length > 0) {
        ret.push(tmp.join('/'));
        ret.pop();
    }
    ret.reverse();
    return ret;
}
class Check {
    constructor() {
        this.rules = { '': {} };
        Check.globalRules.forEach((rule, name) => {
            this.rules[''][name] = rule;
        });
    }
    static setGlobalRules(rules) {
        for (const key of Object.keys(rules)) {
            this.globalRules.set(key, rules[key]);
        }
    }
    setRule(scope, name, rule) {
        this.rules[scope][name] = rule;
    }
    async check(scope, data) {
        const alias = {};
        const ret = [];
        for (const name of genScopeTree(scope)) {
            if (this.rules[name]) {
                Object.keys(this.rules[name]).forEach(n => {
                    alias[n] = this.rules[name][n];
                });
            }
        }
        for (const item of data) {
            ret.push(await Check.do(alias, item));
        }
        return ret;
    }
    static async do(alias, item) {
        if (typeof item.value === 'string' ||
            typeof item.value === 'number' ||
            item.value === null ||
            Array.isArray(item.value)) {
            if (typeof item.rule === 'string') {
                return this.process(alias, item.rule, item.value);
            }
        }
        else {
            if (typeof item.rule === 'object' &&
                Object.keys(item.value) ===
                    Object.keys(item.rule)) {
                for (const name of Object.keys(item.value)) {
                    const r = await this.process(alias, item.rule[name], item.value[name]);
                    if (r > 0) {
                        return r;
                    }
                }
            }
        }
        return 0;
    }
    static async process(alias, rule, value) {
        if (Array.isArray(value)) ;
        else {
            const reg = new RegExp(CheckRules.GRAMMAR);
            const [_, type, action, warp] = rule.matchAll(reg).next().value;
            switch (type) {
                case CheckRules.IS_IN_ARRAY:
                    return 0;
            }
        }
        return 0;
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

exports.Check = Check;
exports.CheckRules = CheckRules;
//# sourceMappingURL=value-check.cjs.js.map
