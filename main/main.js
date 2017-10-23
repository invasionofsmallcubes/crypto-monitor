const tbot = require('node-telegram-bot-api');
const loki = require("lokijs");
const LokiFSStructuredAdapter = require('lokijs/src/loki-fs-structured-adapter');
const winston = require('winston');
const Papertrail = require('winston-papertrail').Papertrail;
const makeUserRepository = require('./userRepository');
const initRepository = require('./lokijsInit');
const makeRestController = require('./controller');
const makeMessageProvider = require('./messageProvider');
const makeAdmin = require('./usecase/admin');
const makeRegister = require('./usecase/register');
const makeDeletion = require('./usecase/delete');

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

    const bot = new tbot(TOKEN, {polling: true});

    const logger = new winston.Logger({
        transports: [
            new Papertrail({
                host: PAPERTRAIL_HOST,
                port: PAPERTRAIL_PORT,
                colorize: true
            })
        ]
    });

    const userRepository = makeUserRepository(initRepository(db, TABLE), logger);
    makeRestController(userRepository, HTTP_PORT, logger);
    const messageProvider = makeMessageProvider(bot);
    const admin = makeAdmin(PASSWORD, userRepository, messageProvider, logger);
    const register = makeRegister(userRepository, messageProvider, logger);
    const deletion = makeDeletion(userRepository, messageProvider);
    
    bot.onText(/\/adminbardoculo ([\w-\/\\\*\&\#\%\@]+) (.+)/, function onEchoText(msg, match) {
        const chatId = msg.chat.id;
        const password = match[1];
        const message = match[2];
        admin.handle(chatId, password, message);
    });

    bot.onText(/\/start/, function onEchoText(msg) {
        register.handle(msg.chat.id);
    });

    bot.onText(/\/unsubscribe/, function onEchoText(msg) {
        deletion.handle(msg.chat.id);
    });

    bot.onText(/\/ping/, function onEchoText(msg) {
        logger.info("pong from chat id: " + msg.chat.id);
        messageProvider.send(msg.chat.id, "pong!");
    });

    bot.on('message', function (msg) {
        logger.info(JSON.stringify(msg, null, 2));
        messageProvider.send(msg.chat.id, 'Sorry I didn\'t understand the command');
    });
}

module.exports = appBootStrap;