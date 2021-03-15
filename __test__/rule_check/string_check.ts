import {Check, CheckData, CheckRules} from "../../src";

describe('string valid check', () => {
    const check = new Check();
    it('string valid 1', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_STRING,
            value: '123'
        });
        expect(await check.check(data)).toStrictEqual([true])
    });
    it('string valid 2', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_STRING,
            value: 'abc~^%&*$'
        });
        expect(await check.check(data)).toStrictEqual([true])
    });
    it('string valid 3', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_STRING,
            value: ''
        });
        expect(await check.check(data)).toStrictEqual([true])
    });
    // 待确认转义是不是字符串
    it('string valid 4', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_STRING,
            value: '\n'
        });
        expect(await check.check(data)).toStrictEqual([true])
    });
});

describe('string not valid check', () => {
    const check = new Check();
    it('string not valid 1', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_STRING,
            value: 1
        });
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('string not valid 2', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_STRING,
            value: 1.2
        });
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('string valid 3', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_STRING,
            value: ['123']
        });
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('string valid 4', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_STRING,
            value: { a: '123' }
        });
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('string valid 5', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_STRING,
            value: null
        });
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('string valid 6', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_STRING,
            value: undefined
        });
        expect(await check.check(data)).toStrictEqual([false])
    });
});