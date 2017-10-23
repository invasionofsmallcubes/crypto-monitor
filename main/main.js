const loki = require("lokijs");
const LokiFSStructuredAdapter = require('lokijs/src/loki-fs-structured-adapter');
const tbot = require('node-telegram-bot-api');

const makeLogger = require('./logger');
const makeUserRepository = require('./userRepository');
const initRepository = require('./lokijsInit');
const makeRestController = require('./controller/restController');
const makeMessageProvider = require('./messageProvider');
const makeAdmin = require('./usecase/admin');
const makeRegister = require('./usecase/register');
const makeDeletion = require('./usecase/delete');
const makeBotController = require('./controller/botController');

const TABLE = 'subscribers';
const DB = 'beecoolit';

const PASSWORD = process.env.PASSWORD || (function () { throw new Error("please set the PASSWORD environmental variable");}());

const TOKEN = process.env.TOKEN || 'TOKEN';

const HTTP_PORT = process.env.HTTP_PORT || 8081;

const PAPERTRAIL_HOST = process.env.PAPERTRAIL_HOST || 'localhost';
const PAPERTRAIL_PORT = process.env.PAPERTRAIL_PORT || 8080;

const db = new loki(DB + '.db', {
    adapter: new LokiFSStructuredAdapter(),
    autoload: true,
    autoloadCallback: appBootStrap
});

function appBootStrap() {

    const logger = makeLogger(PAPERTRAIL_HOST, PAPERTRAIL_PORT);
    const table = initRepository(db, TABLE);
    const userRepository = makeUserRepository(table, logger);
    const messageProvider = makeMessageProvider(tbot);
    const admin = makeAdmin(PASSWORD, userRepository, messageProvider, logger);
    const register = makeRegister(userRepository, messageProvider, logger);
    const deletion = makeDeletion(userRepository, messageProvider);

    makeRestController(userRepository, HTTP_PORT, logger);

    makeBotController(tbot, admin, register, deletion, messageProvider, logger);

}

module.exports = appBootStrap;