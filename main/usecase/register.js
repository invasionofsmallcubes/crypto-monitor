function makeRegister(userRepository, messageProvider, logger) {
    return {
        handle : function(id) {
            logger.info("saving... " + id);
            if (!userRepository.findById(id)) {
                userRepository.save(id);
            }
            messageProvider.send(id, 'Welcome!');
        }
    }
}

module.exports = makeRegister;