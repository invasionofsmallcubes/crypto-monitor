const express = require('express');

function makeController(userRepository, HTTP_PORT, logger) {
            const app = express();
            app.get('/', function (req, res) {
                userRepository.getCount().then((count) => res.send(`Count: ${count}`));
            });
            app.listen(HTTP_PORT, function () {
                logger.info('App listening on port ' + HTTP_PORT + '!');
            });
            return app;
}

module.exports = makeController;