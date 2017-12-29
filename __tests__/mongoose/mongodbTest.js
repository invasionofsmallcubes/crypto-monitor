const mongodb = require('mongodb')

const url = 'CONNECTION_URL'

describe.skip('my beverage', () => {
    test('can work', function (done) {

        mongodb.MongoClient.connect(url, (err, client) => {

            if(err) {
                console.log(err);
                expect(false).toBe(true);
            } else {
                expect(true).toBe(true);
            }

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
                }],
            (err, result) => {
                if (err) { expect(false).toBe(true); }

                collection
                .find({name : "F"})
                .sort({last_updated: -1})
                .limit(2)
                .toArray( (err, result) => {
                        if (err) { expect(false).toBe(true); }
                        expect(result.length).toBe(2);
                        expect(result[0].last_updated).toEqual(new Date(127, 10));
                        expect(result[0].name).toBe('F');
                        collection
                        .drop( (err, delOK) => {
                            if (err) { expect(false).toBe(true); }
                            expect(delOK).toBe(true);
                            client.close();
                            done();
                        });
                    });
            });
        });
    });
});

