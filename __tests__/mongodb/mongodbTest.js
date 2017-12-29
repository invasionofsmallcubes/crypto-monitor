const mongodb = require('mongodb')

const url = 'CONNECTION URL'

describe.skip('my beverage', () => {
    test('can work', function (done) {

        mongodb
        .MongoClient
        .connect(url)
        .then( (client) => {
            const db = client.db("test");

            const collection = db.collection('testDocuments');

            collection
            .insertMany([
                {
                    name: "F",
                    symbol: "B1",
                    last_updated: new Date(123, 10)
                },
                {
                    name: "F",
                    symbol: "B2",
                    last_updated: new Date(125, 10)
                },
                {
                    name: "F",
                    symbol: "B3",
                    last_updated: new Date(127, 10)
                }])
                .then( (result) => {
                    collection
                    .find({name : "F"})
                    .sort({last_updated: -1})
                    .limit(2)
                    .toArray()
                    .then( (results) => {

                        expect(results.length).toBe(2);
                        expect(results[0].last_updated).toEqual(new Date(127, 10));
                        expect(results[0].name).toBe('F');

                        collection
                        .drop()
                        .then( (delOK) => {
                            expect(delOK).toBe(true);
                            client.close();
                            done();
                        })
                        .catch( (err) => {
                            console.log(err);
                            expect(false).toBe(true);
                            client.close();
                        });
                    })
                    .catch( (err) => {
                        console.log(err);
                        expect(false).toBe(true);
                        client.close();
                    });
            })
            .catch( (err) => {
                console.log(err);
                expect(false).toBe(true);
                client.close();
            })
            .catch( (err) => {
                console.log(err);
                expect(false).toBe(true);
                client.close();
            });
        });
    });
});

