// @flow

const tbot = require('node-telegram-bot-api');

// const makeLogger = require('./logger');
const makeRestController = require('./controller/restController');
const makeMessageProvider = require('./adapters/messageProvider');
const makeBotController = require('./controller/botController');
const coinRegister = require('./makeBitCoinGreatAgain/coinRegister').default;
const cache = require('memory-cache');

import Logger from './makeBitCoinGreatAgain/logger'
import { CoinProvider } from './makeBitCoinGreatAgain/coinProvider';
import { CoinRepository } from './makeBitCoinGreatAgain/coinRepository';
const makeLogger = require('./makeBitCoinGreatAgain/logger');

//const PASSWORD = process.env.PASSWORD || (function () { throw new Error("please set the PASSWORD environmental variable");}());

const TOKEN = process.env.TOKEN || 'TOKEN';

const HTTP_PORT = process.env.HTTP_PORT || 8081;

const PAPERTRAIL_HOST = process.env.PAPERTRAIL_HOST || 'localhost';
const PAPERTRAIL_PORT = process.env.PAPERTRAIL_PORT || 8080;

const MONGO_DB_URL = process.env.MONGO_DB_URL || 'mongodb://localhost:27017';
const MONGO_DB_NAME = 'test';
const MONGO_DB_COLLECTION = 'coins';

const TIME_REPEAT = 3600000;
// const TIME_REPEAT = 1200000;

const mongodb = require('mongodb');
async function init() {

    const logger = new Logger()
    
    let client = null
    try {
        client = await mongodb.MongoClient.connect(MONGO_DB_URL)
    } catch (e) {
        logger.error(e)
    }

    const coinProvider = new CoinProvider(logger)

    const coinRepository = new CoinRepository(client, MONGO_DB_NAME, MONGO_DB_COLLECTION)

    makeRestController(HTTP_PORT, cache, coinProvider, coinRepository, TIME_REPEAT)

    setInterval(async () => {
        try {
            logger.info('starting...')
            await coinRegister(coinProvider, coinRepository, () => { return new Date() }, cache)
            logger.info('finished...')
        } catch (e) {
            logger.error('FOUND ERROR')
            logger.error(e)
        }
    }, TIME_REPEAT)
}

init()