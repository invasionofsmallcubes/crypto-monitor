const tbot = require('node-telegram-bot-api');
const loki = require("lokijs");
const LokiFSStructuredAdapter = require('lokijs/src/loki-fs-structured-adapter');
const winston = require('winston');
const Papertrail = require('winston-papertrail').Papertrail;
const makeUserRepository = require('./userRepository');
const initRepository = require('./lokijsInit');
const makeController = require('./controller');

const TABLE = 'subscribers';
const DB = 'beecoolit';

const PASSWORD = process.env.PASSWORD || (function () {
    throw new Error("please set the PASSWORD environmental variable");
}());

const TOKEN = process.env.TOKEN || 'TOKEN';

const HTTP_PORT = process.env.HTTP_PORT || 8081;

const PAPERTRAIL_HOST = process.env.PAPERTRAIL_HOST || 'localhost';
const PAPERTRAIL_PORT = process.env.PAPERTRAIL_PORT || 8080;

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

const db = new loki(DB + '.db', {
    adapter: new LokiFSStructuredAdapter(),
    autoload: true,
    autoloadCallback: appBootStrap
});

function appBootStrap() {

    const userRepository = makeUserRepository(initRepository(db, TABLE), logger);
    makeController(userRepository, HTTP_PORT, logger);

    bot.onText(/\/adminbardoculo ([\w-\/\\\*\&\#\%\@]+) (.+)/, function onEchoText(msg, match) {

        const chatId = msg.chat.id;
        const password = match[1];

        if (password === PASSWORD) {
            const message = match[2];

            const users = userRepository.findAllUsers();
            for (let user of users) {
                bot.sendMessage(user.chatId, message, {parse_mode: 'markdown'});
            }

            bot.sendMessage(chatId, 'Message sent to ' + userRepository.getCount() + ' people');
        } else {
            logger.error(chatId + ' attempted to use send command!');
            bot.sendMessage(chatId, "You can't use that command!");
        }
    });

    bot.onText(/\/ping/, function onEchoText(msg) {
        logger.info("pong from chat id: " + msg.chat.id);
        bot.sendMessage(msg.chat.id, "pong!");
    });

    bot.onText(/\/start/, function onEchoText(msg) {

        let id = msg.chat.id;
        logger.info("saving... " + id);

        let user = userRepository.findById(id);
        if (!user) {
            userRepository.save(id);
        }

        bot.sendMessage(id, 'Welcome!');
    });

    bot.onText(/\/unsubscribe/, function onEchoText(msg) {
        logger.info("unsubscribing... " + msg.chat.id);

        userRepository.delete(msg.chat.id);

        bot.sendMessage(msg.chat.id, 'Sad to see you leave! Hope you come back soon :)');
    });

    bot.on('message', function (msg) {
        logger.info(JSON.stringify(msg, null, 2));
    });
}

module.exports = appBootStrap;