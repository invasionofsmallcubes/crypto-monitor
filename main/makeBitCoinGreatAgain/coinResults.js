// @flow

import {Coin, CoinProvider} from './coinProvider'
import {CoinRepository, CoinProjection} from './coinRepository'

export default async function coinResults(coinProvider: CoinProvider, coinRepository: CoinRepository) : Promise<Array<CoinProjection>> {
        const coins: Array<Coin> = await coinProvider.getCoins();
        const results: Array<CoinProjection> = await Promise.all(coins.map(async (current) => {
              const lastHour : CoinProjection = await coinRepository.findLast(current.symbol);
              return lastHour;
        }));
        return results.filter( (elem) => elem !== undefined);
}
