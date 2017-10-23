function makeMessageProvider(provider) {
    return {
        send: function(id, message) {
            provider.sendMessage(id, message, {parse_mode: 'markdown'});
        }
    }
}

module.exports = makeMessageProvider;