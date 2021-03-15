import {Check, CheckData, CheckRules} from "../../src";

describe('int valid check', () => {
    const check = new Check();
    it('int valid 1', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_INT,
            value: 123456
        }];
        expect(await check.check(data)).toStrictEqual([true])
    });
    it('int valid 2', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_INT,
            value: 0
        }];
        expect(await check.check(data)).toStrictEqual([true])
    });
    it('int valid 3', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_INT,
            value: -1
        }];
        expect(await check.check(data)).toStrictEqual([true])
    });
});

describe('int not valid check', () => {
    const check = new Check();
    it('int not valid 1', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_INT,
            value: '12'
        }];
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('int valid 2', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_INT,
            value: [12]
        }];
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('int valid 3', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_INT,
            value: 1.2
        }];
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('int valid 4', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_INT,
            value: null
        }];
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('int valid 5', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_INT,
            value: undefined
        }];
        expect(await check.check(data)).toStrictEqual([false])
    });
});