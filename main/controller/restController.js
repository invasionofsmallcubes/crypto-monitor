const express = require('express');
const mongodb = require('mongodb');
const makeCoinRepository = require('../makeBitCoinGreatAgain/coinRepository');
const coinResults = require('../makeBitCoinGreatAgain/coinResults');
const makeCoinProvider = require('../makeBitCoinGreatAgain/coinProvider');

function makeRestController(HTTP_PORT, cache, coinProvider, coinRepository, TIME_REPEAT) {

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
                    coins = await coinResults(coinProvider, coinRepository);
                    cache.put('coins', coins);
                }
                res.send(coins);
            } catch (e) {
                console.log(e);
            }
    });

    app.get('/:coin', async function (req, res) {
    try {
        const coins = await coinRepository
        .findLastRecordsAbout(req.params['coin'], 24);
        res.send(coins);
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