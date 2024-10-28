import { port } from './app.js';
import { default as DBG } from 'debug';
const debug = DBG('hs-members:debug');
const dbgerror = DBG('hs-members:error');

export function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

export function onError(error) {
    dbgerror(error);
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string' ? 'Pipe ' + port
        : 'port ' + port;
    switch (error.code) {
        case 'EACCESS':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        case 'EMEMBERSSTORE':
            console.error(`Members data store initialization failure because `, error.error);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

import { server } from './app.js';
export function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug(`Listening on ${bind}`);
}

export function handle404(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
}

export function basicErrorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development'
        ? err : {};
    res.status(err.status || 500);
    res.render('error');
}

process.on('uncaughtException', function(err) {
    console.error(`I've crashed!!! – ${err.stack || err}`);
});

import * as util from 'util';
process.on('unhandledRejection', (reason, p) => {
    console.error(`Unhandled Rejection at: ${util.inspect(p)} reason: ${reason}`);
});
