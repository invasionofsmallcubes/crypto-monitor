const mongodb = require('mongodb')

const HOST_URL = 'CONN';
const DB_NAME = 'test';
const DOCUMENT_NAME = 'coins';

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
        findLast : async (name) => {
            return mongodb
                .MongoClient
                .connect(url)
                .then((client) => {
                    return client
                        .db(dbName)
                        .collection(documentName)
                        .find({symbol: name})
                        .sort({when: -1})
                        .toArray()
                        .then( (results) => {
                            return {
                                hourlyDiff: results[0].hourlyDiff,
                                symbol: results[0].symbol,
                                volume: results[0].volume,
                                when: results[0].when
                            };
                        });
                });
        }
    }
}

beforeEach((done) => {
    mongodb
        .MongoClient
        .connect(HOST_URL)
        .then((client) => {
            client
                .db(DB_NAME)
                .collection(DOCUMENT_NAME)
                .insertMany([
                    {
                        symbol: 'COIN_SYMBOL',
                        volume: 7275670.1,
                        when: new Date(123),
                        hourlyDiff: 0.0
                    },
                    {
                        symbol: 'COIN_SYMBOL',
                        volume: 7275670.2,
                        when: new Date(125),
                        hourlyDiff: 0.1
                    }
                ])
                .then((result) => {
                    done();
                });
        });
});

describe.skip('Given a database', () => {

    test('I can save a coin', (done) => {
        makeCoinRepository(HOST_URL, DB_NAME, DOCUMENT_NAME)
            .save({something: 'OK'})
            .then((result) => {
                expect(result.insertedCount).toBe(1);
                done();
            })
            .catch((e) => {
                console.log(e);
                expect(false).toBeTruthy();
                done();
            });
    });

    test('I can find the latest coin', (done) => {
        makeCoinRepository(HOST_URL, DB_NAME, DOCUMENT_NAME)
            .findLast('COIN_SYMBOL')
            .then((result) => {
                expect(result).toEqual({
                    symbol: 'COIN_SYMBOL',
                    volume: 7275670.2,
                    when: new Date(125),
                    hourlyDiff: 0.1
                });
                done();
            })
            .catch((e) => {
               console.log(e);
               expect(false).toBeTruthy();
               done();
            });
    });
});

afterEach((done) => {
    mongodb
        .MongoClient
        .connect(HOST_URL)
        .then((client) => {
            client
                .db(DB_NAME)
                .collection(DOCUMENT_NAME)
                .drop()
                .then((delOk) => {
                    expect(delOk).toBeTruthy();
                    done();
                });
        });
});

// describe('I can use a mongodb', () => {
//     test('can work', function (done) {
//
//         mongodb
//         .MongoClient
//         .connect(url)
//         .then( (client) => {
//             const db = client.db("test");
//
//             const collection = db.collection('testDocuments');
//
//             collection
//             .insertMany([
//                 {
//                     name: "F",
//                     symbol: "B1",
//                     last_updated: new Date(123, 10)
//                 },
//                 {
//                     name: "F",
//                     symbol: "B2",
//                     last_updated: new Date(125, 10)
//                 },
//                 {
//                     name: "F",
//                     symbol: "B3",
//                     last_updated: new Date(127, 10)
//                 }])
//                 .then( (result) => {
//                     collection
//                     .find({name : "F"})
//                     .sort({last_updated: -1})
//                     .limit(2)
//                     .toArray()
//                     .then( (results) => {
//
//                         expect(results.length).toBe(2);
//                         expect(results[0].last_updated).toEqual(new Date(127, 10));
//                         expect(results[0].name).toBe('F');
//
//                         collection
//                         .drop()
//                         .then( (delOK) => {
//                             expect(delOK).toBe(true);
//                             client.close();
//                             done();
//                         })
//                         .catch( (err) => {
//                             console.log(err);
//                             expect(false).toBe(true);
//                             client.close();
//                         });
//                     })
//                     .catch( (err) => {
//                         console.log(err);
//                         expect(false).toBe(true);
//                         client.close();
//                     });
//             })
//             .catch( (err) => {
//                 console.log(err);
//                 expect(false).toBe(true);
//                 client.close();
//             })
//             .catch( (err) => {
//                 console.log(err);
//                 expect(false).toBe(true);
//                 client.close();
//             });
//         });
//     });
// });

