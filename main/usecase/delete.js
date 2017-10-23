function makeDeletion(userRepository, messageProvider, logger) {
    return {
        handle : function (id) {
            logger.info("unsubscribing... " + id);
            userRepository.delete(id);
            messageProvider.send(id, 'Sad to see you leave! Hope you come back soon :)');
        }
    }
}