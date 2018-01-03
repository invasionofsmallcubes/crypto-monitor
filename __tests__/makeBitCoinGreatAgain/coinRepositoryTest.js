const mongodb = require('mongodb');
const makeCoinRepository = require('../../main/makeBitCoinGreatAgain/coinRepository');

const HOST_URL = 'mongodb://localhost:27017';
const DB_NAME = 'test';
const DOCUMENT_NAME = 'coins';

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

describe('Given a database', () => {

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

    test('I can handle coin not found', (done) => {
        makeCoinRepository(HOST_URL, DB_NAME, DOCUMENT_NAME)
            .findLast('NOT_FOUND')
            .then((result) => {
                expect(result).toBeUndefined();
                done();
            })
            .catch((e) => {
                expect(false).toBeTruthy();
                done();
            });
    });

    test('I can handle last records', (done) => {
        makeCoinRepository(HOST_URL, DB_NAME, DOCUMENT_NAME)
            .findLastRecordsAbout('COIN_SYMBOL', 3)
            .then((results) => {
                expect(results.length).toBe(2);
                expect(results[0].when).toEqual(new Date(125));
                done();
            })
            .catch((e) => {
                expect(false).toBeTruthy();
                done();
            });
    });

    test('I can handle last records not found', (done) => {
        makeCoinRepository(HOST_URL, DB_NAME, DOCUMENT_NAME)
            .findLastRecordsAbout('NOT_FOUND', 3)
            .then((results) => {
                expect(results.length).toBe(0);
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