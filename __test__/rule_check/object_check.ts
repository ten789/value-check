import {Check, CheckData, CheckRules} from "../../src";

describe('object valid check', () => {
    const check = new Check();
    it('object valid 1', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_OBJECT,
            value: { a: 'ccc' }
        }];
        expect(await check.check(data)).toStrictEqual([true])
    });
    it('object valid 2', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_OBJECT,
            value: { }
        }];
        expect(await check.check(data)).toStrictEqual([true])
    });
});

describe('object not valid check', () => {
    const check = new Check();
    it('object not valid 1', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_OBJECT,
            value: ['11']
        }];
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('object not valid 2', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_OBJECT,
            value: undefined
        }];
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('object not valid 3', async () => {
        const data: CheckData[] = [{
            rule: CheckRules.IS_OBJECT,
            value: null
        }];
        expect(await check.check(data)).toStrictEqual([false])
    });
});