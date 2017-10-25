const express = require('express');

function makeRestController(userRepository, HTTP_PORT, logger) {
            const app = express();
            app.get('/', function (req, res) {
                userRepository.getCount().then((count) => res.send(`Count: ${count}`));
            });
            const server = app.listen(HTTP_PORT, function () {
                logger.info('App listening on port ' + HTTP_PORT + '!');
            });
            return server;
}

module.exports = makeRestController;