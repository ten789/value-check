import {Check, CheckData, CheckRules} from "../../src";

describe('boolean valid check', () => {
    const check = new Check();
    it('boolean true', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_BOOLEAN,
            value: true
        });
        expect(await check.check(data)).toStrictEqual([true])
    });
    it('boolean false', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_BOOLEAN,
            value: false
        });
        expect(await check.check(data)).toStrictEqual([true])
    });
    it('boolean false', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_BOOLEAN,
            value: 1 in [0, 9]
        });
        expect(await check.check(data)).toStrictEqual([true])
    });
});

describe('boolean not valid check', () => {
    const check = new Check();

    it('boolean not valid 1', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_BOOLEAN,
            value: 1
        });
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('boolean not valid 1', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_BOOLEAN,
            value: 0
        });
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('boolean not valid 3', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_BOOLEAN,
            value: '1'
        });
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('boolean not valid 4', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_BOOLEAN,
            value: '0'
        });
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('boolean not valid 5', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_BOOLEAN,
            value: [1]
        });
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('boolean not valid 6', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_BOOLEAN,
            value: [0]
        });
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('boolean not valid 7', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_BOOLEAN,
            value: null
        });
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('boolean not valid 8', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_BOOLEAN,
            value: ''
        });
        expect(await check.check(data)).toStrictEqual([false])
    });
    it('boolean not valid 9', async () => {
        const data: CheckData[] = [];
        data.push({
            rule: CheckRules.IS_BOOLEAN,
            value: undefined
        });
        expect(await check.check(data)).toStrictEqual([false])
    });
});