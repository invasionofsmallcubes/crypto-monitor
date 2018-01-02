var Client = require('node-rest-client-promise').Client;

function getCoinProvider() {
    return {
        getCoins: async function() {

            const client = new Client();
            const r = await client.getPromise("https://api.coinmarketcap.com/v1/ticker/?limit=0");

            if(r.response.statusCode === 200) {
                return r.data.map(x => { return {
                    symbol: x.symbol,
                    volume: parseFloat(x['24h_volume_usd']),
                    when: new Date(parseInt(x.last_updated))} });
            } else {
                return Promise.reject('Response was ' + r.response.statusCode);
            }
        }
    }
}

module.exports = getCoinProvider;