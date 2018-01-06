const express = require('express');
const mongodb = require('mongodb');
const makeCoinRepository = require('../makeBitCoinGreatAgain/coinRepository');
const coinResults = require('../makeBitCoinGreatAgain/coinResults');
const makeCoinProvider = require('../makeBitCoinGreatAgain/coinProvider');
const cache = require('memory-cache');

function makeRestController(HTTP_PORT, MONGO_DB_URL, MONGO_DB_COLLECTION, MONGO_DB_NAME, TIME_REPEAT) {

    const app = express();

    app.use(function (req, res, next) {
      res.set('Access-Control-Allow-Origin', '*');
      next();
    });

    app.get('/', async function (req, res) {
        try {
                let coins = cache.get('coins');
                if (coins === null) {
                    console.log('not found in cache')
                    const client = await mongodb.MongoClient.connect(MONGO_DB_URL);
                    moneys = await coinResults(makeCoinProvider(), makeCoinRepository(client, MONGO_DB_NAME, MONGO_DB_COLLECTION));
                    client.close();
                    cache.put('coins', moneys, TIME_REPEAT);
                }
                res.send(moneys);
            } catch (e) {
                console.log(e);
            }
    });

    app.get('/:coin', async function (req, res) {
    try {
        const client = await mongodb.MongoClient.connect(MONGO_DB_URL);
        const money = makeCoinRepository(client, MONGO_DB_NAME, MONGO_DB_COLLECTION)
        .findLastRecordsAbout(req.params['coin'], 24);
        client.close();
        res.send(elems);
        } catch (e) {
            console.log(e);
        }
    });

    const server = app.listen(HTTP_PORT, '0.0.0.0', function () {
        console.log('App listening on port ' + HTTP_PORT + '!');
    });
    return server;
}

module.exports = makeRestController;