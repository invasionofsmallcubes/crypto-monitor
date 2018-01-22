const coinRegister = require('../../main/makeBitCoinGreatAgain/coinRegister').default;

describe('coin register use case', () => {

    test('no result on record', async () => {
        const coinProvider = {getCoins: jest.fn()};
        const cache = { del: jest.fn() }
        const coinRepository = {findLast: jest.fn(), save: jest.fn()};
        const currentDate = new Date(123);

        coinProvider.getCoins.mockReturnValueOnce(Promise.resolve(
            [{symbol: 'S', volume: 12451200000.0, when: new Date(123)},
                {symbol: 'T', volume: 12451200000.2, when: new Date(125)}]));

        coinRepository.findLast.mockReturnValueOnce(Promise.resolve(undefined));

        await coinRegister(coinProvider, coinRepository, () => {
            return currentDate
        }, cache);

        expect(cache.del.mock.calls.length).toBe(1);
        expect(cache.del.mock.calls[0][0])
            .toEqual('coins');

        expect(coinRepository.save.mock.calls.length).toBe(2);
        expect(coinRepository.save.mock.calls[0][0])
            .toEqual({symbol: 'S', volume: 12451200000.0, when: currentDate, hourlyDiff: 0.0});
        expect(coinRepository.save.mock.calls[1][0])
            .toEqual({symbol: 'T', volume: 12451200000.2, when: currentDate, hourlyDiff: 0.0});

    });

    test('with result on record', async () => {
        const coinProvider = {getCoins: jest.fn()};
        const coinRepository = {findLast: jest.fn(), save: jest.fn()};
        const currentDate = new Date(123);
        const cache = { del: jest.fn() }


        coinProvider.getCoins.mockReturnValueOnce(Promise.resolve(
            [{symbol: 'S', volume: 12451200000.0, when: new Date(123)},
                {symbol: 'T', volume: 12451200000.0, when: new Date(125)}]));

        coinRepository.findLast
            .mockReturnValueOnce(Promise.resolve({symbol: 'S', volume: 12451200001.0, when: new Date(123)}))
            .mockReturnValueOnce(Promise.resolve({symbol: 'T', volume: 12451200001.0, when: new Date(123)}));

        await coinRegister(coinProvider, coinRepository, () => {
            return currentDate
        }, cache);

        expect(cache.del.mock.calls.length).toBe(1);
        expect(cache.del.mock.calls[0][0])
            .toEqual('coins');

        expect(coinRepository.save.mock.calls.length).toBe(2);
        expect(coinRepository.save.mock.calls[0][0])
            .toEqual({symbol: 'S', volume: 12451200000.0, when: currentDate, hourlyDiff: -1});
        expect(coinRepository.save.mock.calls[1][0])
            .toEqual({symbol: 'T', volume: 12451200000.0, when: currentDate, hourlyDiff: -1});

    });

});