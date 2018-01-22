const coinResults = require('../../main/makeBitCoinGreatAgain/coinResults').default;

describe('coin results use case', () => {

    test('no result on record', async () => {
        const coinProvider = {getCoins: jest.fn()};
        const coinRepository = {findLast: jest.fn(), save: jest.fn()};
        const currentDate = new Date(123);

        coinProvider.getCoins.mockReturnValueOnce(Promise.resolve(
            [{symbol: 'S', volume: 12451200000.0, when: new Date(123)},
                {symbol: 'T', volume: 12451200000.2, when: new Date(125)}]));

        coinRepository.findLast.mockReturnValueOnce(Promise.resolve(undefined));

        const results = await coinResults(coinProvider, coinRepository);

        expect(results.length).toBe(0);

        expect(coinRepository.findLast.mock.calls.length).toBe(2);

        expect(coinRepository.findLast.mock.calls[0][0])
            .toEqual('S');

        expect(coinRepository.findLast.mock.calls[1][0])
            .toEqual('T');

    });

    test('with result on record', async () => {
        const coinProvider = {getCoins: jest.fn()};
        const coinRepository = {findLast: jest.fn(), save: jest.fn()};
        const currentDate = new Date(123);

        coinProvider.getCoins.mockReturnValueOnce(Promise.resolve(
            [{symbol: 'S', volume: 12451200000.0, when: new Date(123)},
                {symbol: 'T', volume: 12451200000.0, when: new Date(125)}]));

        coinRepository.findLast
            .mockReturnValueOnce(Promise.resolve({symbol: 'S', volume: 12451200001.0, when: new Date(123)}))
            .mockReturnValueOnce(Promise.resolve({symbol: 'T', volume: 12451200001.0, when: new Date(123)}));

        const results = await coinResults(coinProvider, coinRepository);

        expect(results.length).toBe(2);

        expect(coinRepository.findLast.mock.calls.length).toBe(2);

        expect(coinRepository.findLast.mock.calls[0][0])
            .toEqual('S');

        expect(coinRepository.findLast.mock.calls[1][0])
            .toEqual('T');
    });

});