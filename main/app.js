var express = require('express');

var app = express();

const TelegramBot = require('node-telegram-bot-api');

const token = '478152078:AAG2PcGOOc1NGaEm5n5BKuBU6N8OBI9yTQ8';

const bot = new TelegramBot(token, {polling: true});

app.get('/', function (req, res) {
    res.send('Hello World')
});

app.listen(8080, function () {
    console.log('App listening on port 8080!')
});

module.exports = app;

bot.onText(/\/adminebardoculo (.+)/, function onEchoText(msg, match) {
    const resp = match[1];
    console.log("sending to everybody " + resp);
    bot.sendMessage(msg.chat.id, resp);
});

bot.onText(/\/ping/, function onEchoText(msg) {
    console.log("pong!");
    bot.sendMessage(msg.chat.id, "pong!");
});

bot.onText(/\/start/, function onEchoText(msg) {
    console.log("saving..." + chatId);
    bot.sendMessage(msg.chat.id, "*Welcome!*");
});

bot.onText(/\/unsubscribe/, function onEchoText(msg) {
    console.log("saving..." + chatId);
    bot.sendMessage(msg.chat.id, "*Welcome!*");
});

bot.on('message', function (msg) {
    console.log("message " + chatId);
});