var Client = require('node-rest-client-promise').Client

function getCoinProvider(logger) {
    return {
        getCoins: async function() {
            try {
              const client = new Client()
              const r = await client.getPromise("https://api.coinmarketcap.com/v1/ticker/?limit=0")

              if(r.response.statusCode === 200) {
                  return r.data.map(x => { return {
                      symbol: x.symbol,
                      volume: parseFloat(x['24h_volume_usd']),
                      when: new Date(parseInt(x.last_updated))} })
              } else {
                  logger.error('Response was ' + r.response.statusCode)
                  console.log('Response was ' + r.response.statusCode)
                  return []
              }
          } catch (error) {
              logger.error(error)
              console.log(error)
              return []
          }
        }
    }
}

module.exports = getCoinProvider;
