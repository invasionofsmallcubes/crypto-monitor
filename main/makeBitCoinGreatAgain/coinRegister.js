// @flow

import { Coin, CoinProvider } from './coinProvider'

let coinRegister = async (coinProvider: CoinProvider, coinRepository: any, dateProvider: any, cache: any) => {
    const coins: Array<Coin> = await coinProvider.getCoins();
    await Promise.all(coins.map(async (current) => {
        const lastHour = await coinRepository.findLast(current.symbol);
        let newRecord = createRecord(lastHour, current, dateProvider());
        await coinRepository.save(newRecord);
    }));
    cache.del('coins');
}

function createRecord(lastHour, current, date) {
    return lastHour ? buildRecord(current, date, current.volume - lastHour.volume) : buildRecord(current, date, 0.0);
}

function buildRecord(current, date, hourlyDiff) {
    return { symbol: current.symbol, volume: current.volume, when: date, hourlyDiff: hourlyDiff }
}

module.exports = coinRegister;