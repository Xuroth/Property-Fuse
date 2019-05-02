const root      =   require('app-root-path');
const winston   =   require('winston');

const options = {
    console: {
        level: 'debug',
        handleExceptions: true,
        format: winston.format.simple(),
        colorize: true
    }
};

let logger = winston.createLogger({
    transports: [
        new winston.transports.Console(options.console)
    ],
    exitOnError: false
});

logger.stream = {
    write: (msg, enc) => {
        logger.log(msg);
    }
};

module.exports = logger;