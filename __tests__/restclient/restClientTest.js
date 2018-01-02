const nock = require('nock');

var Client = require('node-rest-client').Client;

beforeEach( () => {
    nock.disableNetConnect();

    nock('https://api.coinmarketcap.com')
        .get('/v1/ticker/?limit=0')
        .reply(200,
            [
                {
                    id: "ethos",
                    name: "Ethos",
                    symbol: "ETHOS",
                    rank: "101",
                    price_usd: "2.66829",
                    price_btc: "0.0001834",
                    '24h_volume_usd': "7275670.0",
                    market_cap_usd: "201194302.0",
                    available_supply: "75401962.0",
                    total_supply: "222295208.0",
                    max_supply: null,
                    percent_change_1h: "-0.42",
                    percent_change_24h: "11.95",
                    percent_change_7d: "1.12",
                    last_updated: "1514579653"
                },
                {
                    id: "enigma-project",
                    name: "Enigma",
                    symbol: "ENG",
                    rank: "102",
                    price_usd: "2.62982",
                    price_btc: "0.00018075",
                    '24h_volume_usd': "17769400.0",
                    market_cap_usd: "196805659.0",
                    available_supply: "74836171.0",
                    total_supply: "150000000.0",
                    max_supply: null,
                    percent_change_1h: "-0.62",
                    percent_change_24h: "3.67",
                    percent_change_7d: "183.24",
                    last_updated: "1514579656"
                },
                {
                    id: "bitbay",
                    name: "BitBay",
                    symbol: "BAY",
                    rank: "103",
                    price_usd: "0.189787",
                    price_btc: "0.00001304",
                    '24h_volume_usd': "6553420.0",
                    market_cap_usd: "191427349.0",
                    available_supply: "1008643106.0",
                    total_supply: "1008643106.0",
                    max_supply: null,
                    percent_change_1h: "-2.13",
                    percent_change_24h: "-0.09",
                    percent_change_7d: "4.38",
                    last_updated: "1514579645"
                }
            ]);

});

describe('I can respond to query', () => {

    test('can work', (done) => {

        var client = new Client();

        client.get("https://api.coinmarketcap.com/v1/ticker/?limit=0", function (data, response) {

            expect(data.length).toBe(3)
            expect(response.statusCode).toBe(200)
            done()

        });

    });

})
