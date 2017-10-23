const winston = require('winston');
const Papertrail = require('winston-papertrail').Papertrail;

function makeLogger(PAPERTRAIL_HOST, PAPERTRAIL_PORT) {
    return new winston.Logger({
        transports: [
            new Papertrail({
                host: PAPERTRAIL_HOST,
                port: PAPERTRAIL_PORT,
                colorize: true
            })
        ]
    });
}

module.exports = makeLogger;