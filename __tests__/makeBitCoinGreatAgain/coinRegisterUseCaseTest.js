describe.skip('coin register use case', () => {

    test('no result on record', (done) => {
        const coinProvider = {getCoins: jest.fn()};
        const coinRepository = {findLast: jest.fn(), save: jest.fn()};

        coinProvider.getCoins.mockReturnValueOnce(
            [{symbol: 'S', volume: 12451200000.0, when: new Date(123)},
                {symbol: 'T', volume: 12451200000.2, when: new Date(125)}]);

        coinRepository.findLast.mockReturnValueOnce(undefined);

        expect(coinRepository.save.mock.calls.length).toBe(2);
        expect(coinRepository.save.mock.calls[0][0])
            .toEqual( { symbol: 'S', volume: 12451200000.0, when: new Date(123), hourlyDiff: 0.0 })
        expect(coinRepository.save.mock.calls[1][0])
            .toEqual( { symbol: 'T', volume: 12451200000.2, when: new Date(125), hourlyDiff: 0.0 })

    });

});