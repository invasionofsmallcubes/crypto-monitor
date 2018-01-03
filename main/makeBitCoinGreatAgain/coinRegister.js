async function coinRegister(coinProvider, coinRepository) {
        const coins = await coinProvider.getCoins()
        console.log('found coins')
          await Promise.all(coins.map(async (current) => {
                const lastHour = await coinRepository.findLast(current.symbol);
                let newRecord = null;
                if(lastHour) {
                    newRecord = { symbol: current.symbol, volume: current.volume, when: current.when, hourlyDiff: current.volume - lastHour.volume }
                } else {
                    newRecord = { symbol: current.symbol, volume: current.volume, when: current.when, hourlyDiff: 0.0 }
                }
                await coinRepository.save(newRecord);
                console.log('saved...' + newRecord.symbol)
          }));
}

module.exports = coinRegister;