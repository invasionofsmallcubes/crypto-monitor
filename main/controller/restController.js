const express = require('express');
const mongodb = require('mongodb');
const makeCoinRepository = require('../makeBitCoinGreatAgain/coinRepository');

function makeRestController(HTTP_PORT, MONGO_DB_URL, MONGO_DB_COLLECTION, MONGO_DB_NAME) {
    const app = express();
    app.get('/:coin', function async(req, res) {
        const client = mongodb.MongoClient.connect(MONGO_DB_URL).then((client) => {
            makeCoinRepository(client, MONGO_DB_NAME, MONGO_DB_COLLECTION)
                .findLastRecordsAbout(req.params['coin'], 24)
                .then((elems) => {
                    res.send(elems);
                    client.close();
                });
        });
    });

    const server = app.listen(HTTP_PORT, function () {
        console.log('App listening on port ' + HTTP_PORT + '!');
    });
    return server;
}

module.exports = makeRestController;