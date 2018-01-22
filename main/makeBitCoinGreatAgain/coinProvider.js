// @flow
import Logger from './logger'

var Client = require('node-rest-client-promise').Client

export default function getCoinProvider(logger: Logger) {
    return new CoinProvider(logger)
}

export class Coin {
    symbol: string
    volume: number
    when: Date
    constructor(symbol: string, volume: number, when: Date) {
        this.symbol = symbol
        this.volume = volume
        this.when = when
    }
}

export class CoinProvider {
    logger: Logger
    constructor(logger : Logger) {
        this.logger = logger;
    }
    async getCoins() : Promise<Array<Coin>> {
        try {
            const client = new Client()
            const r = await client.getPromise("https://api.coinmarketcap.com/v1/ticker/?limit=0")

            if(r.response.statusCode === 200) {
                return r.data.map(x => { 
                    return new Coin( x.symbol, parseFloat(x['24h_volume_usd']), new Date(parseInt(x.last_updated))) 
                })
            } else {
                this.logger.error('Response was ' + r.response.statusCode)
                return []
            }
        } catch (error) {
            this.logger.error(error)
            return []
        }
    }
}

