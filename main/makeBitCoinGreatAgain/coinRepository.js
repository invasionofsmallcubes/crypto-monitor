const mongodb = require('mongodb');

function makeCoinRepository(url, dbName, documentName) {
    return {
        save: async (coin) => {
            return mongodb
                .MongoClient
                .connect(url)
                .then((client) => {
                    return client
                        .db(dbName)
                        .collection(documentName)
                        .insertMany([coin]);
                });
        },
        findLast: async (name) => {
            return mongodb
                .MongoClient
                .connect(url)
                .then((client) => {
                    return client
                        .db(dbName)
                        .collection(documentName)
                        .find({symbol: name})
                        .sort({when: -1})
                        .limit(1)
                        .toArray()
                        .then((results) => {
                            if (results.length !== 0) {
                                return {
                                    hourlyDiff: results[0].hourlyDiff,
                                    symbol: results[0].symbol,
                                    volume: results[0].volume,
                                    when: results[0].when
                                };
                            } else {
                                return undefined
                            }
                        });
                });
        },
        findLastRecordsAbout: async (name, limit) => {
            return mongodb
                .MongoClient
                .connect(url)
                .then((client) => {
                    return client
                        .db(dbName)
                        .collection(documentName)
                        .find({symbol: name})
                        .sort({when: -1})
                        .limit(limit)
                        .toArray()
                        .then((results) => {
                            return results.map(r => {
                                return {
                                    hourlyDiff: r.hourlyDiff,
                                    symbol: r.symbol,
                                    volume: r.volume,
                                    when: r.when
                                }
                            });
                        });
                });
        }
    }
}

module.exports = makeCoinRepository;
