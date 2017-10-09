const express = require('express');
const r = require('rethinkdb');
const promisify = require("es6-promisify");

var app = express();

// const db_connect = promisify(r.connect);

// db_connect({ host: '127.0.0.1', port: 28015})
//     .then(function (connection) {
//         console.log(connection);
//         r.db('test').tableCreate('authors').run(connection, function(err, result) {
//             console.log(JSON.stringify(result, null, 2));
//         });
//     }).catch(function (err) {
//         console.error('Ops!', err);
// });


const TelegramBot = require('node-telegram-bot-api');

const token = '478152078:AAG2PcGOOc1NGaEm5n5BKuBU6N8OBI9yTQ8';

const bot = new TelegramBot(token, {polling: true});

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.listen(8080, function () {
    console.log('App listening on port 8080!');
});

module.exports = app;

bot.onText(/\/adminbardoculo (.+) (.+)/, function onEchoText(msg, match) {
    const resp1 = match[1];
    const resp2 = match[2];
    console.log("sending to everybody " + resp1);
    console.log("sending to everybody " + resp2);
});

bot.onText(/\/ping/, function onEchoText(msg) {
    console.log("pong from chat id: " + msg.chat.id );
    bot.sendMessage(msg.chat.id, "pong!");
});

bot.onText(/\/start/, function onEchoText(msg) {
    console.log("saving... " + msg.chat.id);
    bot.sendMessage(msg.chat.id, "*Welcome!*");
});

bot.onText(/\/unsubscribe/, function onEchoText(msg) {
    console.log("unsubscribing... " + chatId);
    bot.sendMessage(msg.chat.id, "*Sad to see you leave! Hope you come back soon :)*");
});

bot.on('message', function (msg) {
    console.log(JSON.stringify(msg, null, 2));
});