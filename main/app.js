const express = require('express');
const tbot = require('node-telegram-bot-api');
const loki = require("lokijs");
const LokiFSStructuredAdapter = require('lokijs/src/loki-fs-structured-adapter');

const TABLE = 'subscribers';
const DB = 'beecoolit';

const PASSWORD = process.env.PASSWORD || function () {
    throw new Error("please set the PASSWORD environmental variable");
};
const TOKEN = process.env.TOKEN || 'TOKEN';

const HTTP_PORT = process.env.HTTP_PORT || 8081;

const bot = new tbot(TOKEN, {polling: true});

var db = new loki(DB + '.db', {
    adapter: new LokiFSStructuredAdapter(),
    autoload: true,
    autoloadCallback : databaseInitialize,
});

function databaseInitialize() {
    var table = db.getCollection(TABLE);
    if (table === null) {
        table = db.addCollection(TABLE);
    }

    var app = express();

    app.get('/', function (req, res) {
        res.send('Count: ' + table.count());
    });

    app.listen(HTTP_PORT, function () {
        console.log('App listening on port ' + HTTP_PORT + '!');
    });

    module.exports = app;

    bot.onText(/\/adminbardoculo ([\w-\/\\\*\&\#\%\@]+) (.+)/, function onEchoText(msg, match) {

        const chatId = msg.chat.id;
        const password = match[1];

        if (password === PASSWORD) {
            const message = match[2];

            const users = table.chain().data();
            for (let user of users) {
                bot.sendMessage(user.chatId, message, {parse_mode: 'markdown'});
            }

            bot.sendMessage(chatId, 'Message sent to ' + table.count() + ' people');
        } else {
            console.error(chatId + ' attempted to use send command!');
            bot.sendMessage(chatId, "You can't use that command!");
        }
    });

    bot.onText(/\/ping/, function onEchoText(msg) {
        console.log("pong from chat id: " + msg.chat.id);
        bot.sendMessage(msg.chat.id, "pong!");
    });

    bot.onText(/\/start/, function onEchoText(msg) {

        console.log("saving... " + msg.chat.id);

        var user = table.findOne({chatId: msg.chat.id});
        if (!user) {
            table.insert({chatId: msg.chat.id});
        }
        db.saveDatabase(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("saved... it can now be loaded or reloaded with up to date data");
            }
        });

        bot.sendMessage(msg.chat.id, 'Welcome!');

    });

    bot.onText(/\/unsubscribe/, function onEchoText(msg) {
        console.log("unsubscribing... " + msg.chat.id);

        var user = table.findOne({chatId: msg.chat.id});
        table.remove(user);
        db.saveDatabase(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("saved... it can now be loaded or reloaded with up to date data");
            }
        });

        bot.sendMessage(msg.chat.id, 'Sad to see you leave! Hope you come back soon :)');
    });

    bot.on('message', function (msg) {
        console.log(JSON.stringify(msg, null, 2));
    });
}