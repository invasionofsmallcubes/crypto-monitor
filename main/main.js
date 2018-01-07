const tbot = require('node-telegram-bot-api');

const makeLogger = require('./logger');
const makeRestController = require('./controller/restController');
const makeMessageProvider = require('./adapters/messageProvider');
const makeBotController = require('./controller/botController');
const makeCoinProvider = require('./makeBitCoinGreatAgain/coinProvider');
const makeCoinRepository = require('./makeBitCoinGreatAgain/coinRepository');
const coinRegister = require('./makeBitCoinGreatAgain/coinRegister');
const cache = require('memory-cache');

//const PASSWORD = process.env.PASSWORD || (function () { throw new Error("please set the PASSWORD environmental variable");}());

const TOKEN = process.env.TOKEN || 'TOKEN';

const HTTP_PORT = process.env.HTTP_PORT || 8081;

const PAPERTRAIL_HOST = process.env.PAPERTRAIL_HOST || 'localhost';
const PAPERTRAIL_PORT = process.env.PAPERTRAIL_PORT || 8080;

const MONGO_DB_URL = process.env.MONGO_DB_URL || 'mongodb://localhost:27017';
const MONGO_DB_NAME = 'test';
const MONGO_DB_COLLECTION = 'coins';

//const TIME_REPEAT = 3600000;
 const TIME_REPEAT = 36000;

const mongodb = require('mongodb');
async function init() {

    const client = await mongodb.MongoClient.connect(MONGO_DB_URL);

    const coinProvider = makeCoinProvider();

    const coinRepository = makeCoinRepository(client, MONGO_DB_NAME, MONGO_DB_COLLECTION);

    makeRestController(HTTP_PORT, cache, coinProvider, coinRepository, TIME_REPEAT);

    setInterval(async () => {
        try {
            console.log('starting...');
            await coinRegister(coinProvider, coinRepository, () => { return new Date() }, cache);
            console.log('finished...');
        } catch (e) {
            console.log('FOUND ERROR');
            console.log(e);
        }
    }, TIME_REPEAT);
}

init();