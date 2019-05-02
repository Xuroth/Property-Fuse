const express       =   require('express');
const bodyParser    =   require('body-parser');
const path          =   require('path');
const fs            =   require('fs');
const config        =   require('dotenv');
const logger        =   require('./config/logging.js');
const moment        =   require('moment');
// const morgan        =   require('morgan');
// const winston       =   require('winston');

//Load configuration and set base variables
config.config({path: path.join(__dirname, '/config/.env')});
const isProduction  =   process.env.NODE_ENV === 'production';
const app           =   express();
app.set('trust proxy', true);
app.use(bodyParser.urlencoded({extended: false}));

//CRON Tasks (if any)
//#------

// API ROUTES
//#api.route.all

//404 handler
app.use((req, res, next) => {
    let err = {
        status: 404,
        message: `[${moment.utc().format('MMM DD YYYY @ hh:mm:ss.SSSSS a')}] ${req.ip} -> ${req.method}: ${req.originalUrl} - [404 - Not Found]`
    };
    next(err);
});

//Default Error Handler
app.use((error, req, res, next) => {
    let err = {
        status: error.status || 500,
        message: error.message || 'Unknown Error'
    };

    logger.error(err);

    res.json(err);
});

let startupAttempts = 0;
let serverPort = process.env.PORT || 3006;
const maxAttempts = process.env.MAX_STARTUP_ATTEMPTS || 0;
const server = app.listen(serverPort, '0.0.0.0', () => {
    logger.info('Server Starting Up...');
    console.log(`Server running on ${serverPort}`);
})
//Check for startup errors
.on('error', (e) => {
    startupAttempts++;
    switch(e.code){
        case 'EADDRINUSE': {
            logger.error(`Server is attempting to use port ${serverPort}, but it's in use by another process. Will retry...`);
            setTimeout(() => {
                if((maxAttempts === 0) || (startupAttempts <= maxAttempts)) {
                    server.close(() => {
                        logger.info(`Retrying... (Startup Attempts: ${startupAttempts}`);
                    });
                    server.listen(serverPort);
                } else {
                    logger.error('Maximum number of attempts to startup reached. Please check configuration of other process or change server PORT and try again.');
                }
            }, 1500);
            break;
        }
    }
});

module.exports = server;