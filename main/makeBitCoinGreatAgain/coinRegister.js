async function coinRegister(coinProvider, coinRepository) {
        const coins = await coinProvider.getCoins()
          await Promise.all(coins.map(async (current) => {
                const lastHour = await coinRepository.findLast(current.symbol);
                let newRecord = null;
                if(lastHour) {
                    newRecord = { symbol: current.symbol, volume: current.volume, when: new Date(), hourlyDiff: current.volume - lastHour.volume }
                } else {
                    newRecord = { symbol: current.symbol, volume: current.volume, when: new Date(), hourlyDiff: 0.0 }
                }
                await coinRepository.save(newRecord);
          }));
}

module.exports = coinRegister;