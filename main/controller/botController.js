function makeBotController(bot, admin, register, deletion, messageProvider, logger) {

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

    return bot;
}

module.exports = makeBotController;