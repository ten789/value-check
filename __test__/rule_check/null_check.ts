import {Check, CheckData, CheckRules} from "../../src";

describe('null valid check', () => {
    const check = new Check();
    it('null valid', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_NULL,
            value: null
        });
        expect(await check.check(data)).toStrictEqual([true])
    });
});

describe('null not valid check', () => {
    const check = new Check();
    it('null not valid 1', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_NULL,
            value: ''
        });
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('null not valid 2', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_NULL,
            value: []
        });
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('null not valid 3', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_NULL,
            value: {}
        });
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('null not valid 4', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_NULL,
            value: false
        });
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('null not valid 5', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_NULL,
            value: undefined
        });
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('null not valid 6', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_NULL,
            value: 1 in [0, 9]
        });
        expect(await check.check(data)).toStrictEqual([false])
    });
});