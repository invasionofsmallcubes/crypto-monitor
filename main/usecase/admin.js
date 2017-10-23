function makeAdmin(PASSWORD, userRepository, messageProvider, logger) {
    return {
        handle: function(id, sentPassword, message) {
            if (sentPassword === PASSWORD) {
                const users = userRepository.findAllUsers();
                for (let user of users) {
                    messageProvider.send(user.chatId, message);
                }

                messageProvider.send(id, 'Message sent to ' + userRepository.getCount() + ' people');
            } else {
                logger.error(id + ' attempted to use send command!');
                messageProvider.send(id, "You can't use that command!");
            }
        }
    }
}

module.exports = makeAdmin;