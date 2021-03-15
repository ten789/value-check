import {Check, CheckData, CheckRules} from "../../src";

describe('float valid check', () => {
    const check = new Check();
    it('float valid 1', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_FLOAT,
            value: 123.456
        }];
        expect(await check.check(data)).toStrictEqual([true])
    });
    it('float valid 2', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_FLOAT,
            value: 0
        }];
        expect(await check.check(data)).toStrictEqual([true])
    });
    it('float valid 3', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_FLOAT,
            value: -123.123
        }];
        expect(await check.check(data)).toStrictEqual([true])
    });
    it('float valid 4', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_FLOAT,
            value: 123
        }];
        expect(await check.check(data)).toStrictEqual([true])
    });
});

describe('float not valid check', () => {
    const check = new Check();
    it('float not valid 1', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_FLOAT,
            value: '123.45'
        }];
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('float not valid 2', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_FLOAT,
            value: [123.45]
        }];
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('float not valid 3', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_FLOAT,
            value: null
        }];
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('float not valid 4', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_FLOAT,
            value: undefined
        }];
        expect(await check.check(data)).toStrictEqual([false])
    });
});