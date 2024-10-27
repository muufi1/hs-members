import { default as express } from 'express';
import { default as hbs } from 'hbs';
import * as path from 'path';
import { default as logger } from 'morgan';
import { default as cookieParser } from 'cookie-parser';
import { default as bodyParser } from 'body-parser';
import * as http from 'http';
import * as rfs from 'rotating-file-stream';
import { default as DBG } from 'debug';
const debug = DBG('hs-members:debug');
const dbgerror = DBG('hs-members:error');
import { approotdir } from './approotdir.js';
const __dirname = approotdir;
import { 
    normalizePort, onError, onListening, handle404, basicErrorHandler 
} from './appsupport.js';
import { InMemoryMembersStore } from './models/members-memory.js';
export const MembersStore = new InMemoryMembersStore();

import { router as indexRouter } from './routes/index.js';
import { router as membersRouter } from './routes/members.js';

export const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'partials'));

app.use(logger(process.env.REQUEST_LOG_FORMAT || 'dev', {
    stream: process.env.REQUEST_LOG_FILE ? 
        rfs.createStream(process.env.REQUEST_LOG_FILE, {
            size: '10M',        // rotate every 10 MegaBytes written
            interval: '1d',     // rotate daily
            compress: 'gzip'    // compress rotated files
        })
        : process.stdout
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/members', membersRouter);

app.use(handle404);
app.use(basicErrorHandler);

export const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

export const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
server.on('request', (req, res) => {
    debug(`${new Date().toISOString()} request ${req.method} ${req.url}`);
});
