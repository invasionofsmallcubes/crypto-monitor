async function coinResults(coinProvider, coinRepository) {
        const coins = await coinProvider.getCoins();
        const results = await Promise.all(coins.map(async (current) => {
              const lastHour = await coinRepository.findLast(current.symbol);
              return lastHour;
        }));
        return results.filter( (elem) => elem !== undefined);
}

module.exports = coinResults;