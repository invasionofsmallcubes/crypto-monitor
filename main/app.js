const express = require('express');
const r = require('rethinkdb');
const tbot = require('node-telegram-bot-api');

const TABLE = 'subscribers';
const DB = 'beecoolit';

const PASSWORD = process.env.PASSWORD || function() { throw new Error("please set the PASSWORD environmental variable"); };
const TOKEN = process.env.TOKEN || 'TOKEN';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = 28015;
const HTTP_PORT = process.env.HTTP_PORT || 8081;

const bot = new tbot(TOKEN, {polling: true});

var connection = null;
r.connect({host: DB_HOST, port: DB_PORT, db: DB}, function (err, conn) {
    if (err) throw err;
    connection = conn;
});

var app = express();

app.get('/', function (req, res) {
    r.table(TABLE).count().run(connection, function (error, count) {
        res.send('Count: ' + count);
    });

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
        r.table(TABLE)
            .run(connection)
            .then(function (cursor) {
                cursor.each(function (error, row) {
                    bot.sendMessage(row['chatId'], message, {parse_mode: 'markdown'});
                });
            }).error(function (error) {
            var errorText = JSON.stringify(error, null, 2);
            bot.sendMessage(chatId, errorText);
            console.error(errorText);
        });

        r.table(TABLE)
            .count()
            .run(connection)
            .then(function (count) {
                bot.sendMessage(chatId, 'Message sent to ' + count + ' people');
            }).error(function (error) {

            bot.sendMessage(chatId, "There was an error!!");
            console.error('problem with counting people');

            var errorText = JSON.stringify(error, null, 2);
            bot.sendMessage(chatId, errorText);
            console.error(errorText);
        });
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

    r.table(TABLE)
        .get(msg.chat.id)
        .replace({chatId: msg.chat.id})
        .run(connection)
        .then(function (insert) {
            console.log("inserted:");
            console.log(JSON.stringify(insert, null, 2));
        }).error(function (error) {
        console.error(JSON.stringify(error));
    });

    bot.sendMessage(msg.chat.id, 'Welcome!');

});

bot.onText(/\/unsubscribe/, function onEchoText(msg) {
    console.log("unsubscribing... " + msg.chat.id);

    r.table(TABLE)
        .filter(r.row('chatId').eq(msg.chat.id))
        .delete()
        .run(connection)
        .then(function (deleted) {
            console.log("deleted:");
            console.log(JSON.stringify(deleted, null, 2));
        }).error(function (error) {
        console.error(JSON.stringify(error));
    });

    bot.sendMessage(msg.chat.id, 'Sad to see you leave! Hope you come back soon :)');
});

bot.on('message', function (msg) {
    console.log(JSON.stringify(msg, null, 2));
});