import {Check, CheckData, CheckRules} from "../../src";

describe('array valid check', () => {
    const check = new Check();
    it('array valid 1', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_ARRAY,
            value: [1, 2, 3, 1.1]
        }];
        expect(await check.check(data)).toStrictEqual([true])
    });
    it('array valid 2', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_ARRAY,
            value: ['a', 'b']
        }];
        expect(await check.check(data)).toStrictEqual([true])
    });
    it('array valid 3', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_ARRAY,
            value: [0]
        }];
        expect(await check.check(data)).toStrictEqual([true])
    });
    it('array valid 4', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_ARRAY,
            value: []
        }];
        expect(await check.check(data)).toStrictEqual([true])
    });
});

describe('array not valid check', () => {
    const check = new Check();
    it('array not valid 1', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_ARRAY,
            value: '[1, 2, 4]'
        }];
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('array not valid 2', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_ARRAY,
            value: 12
        }];
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('array not valid 3', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_ARRAY,
            value: { a: [1] }
        }];
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('array not valid 4', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_ARRAY,
            value: null
        }];
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('array not valid 5', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_ARRAY,
            value: undefined
        }];
        expect(await check.check(data)).toStrictEqual([false])
    });
});