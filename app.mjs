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
import { approotdir } from './approotdir.mjs';
const __dirname = approotdir;
import { 
    normalizePort, onError, onListening, handle404, basicErrorHandler 
} from './appsupport.mjs';
import { useModel as useMembersModel } from './models/members-store.mjs';
useMembersModel(process.env.MEMBERS_MODEL ? process.env.MEMBERS_MODEL : "mariadb")
.then(store => {  })
.catch(error => { onError({ code: 'EMEMBERSSTORE', error }); });
import { default as MariaDBMembersStore } from './models/members-mariadb.mjs';
const membersDB = new MariaDBMembersStore();
import session from 'express-session';
import sessionFileStore from 'session-file-store';
const FileStore = sessionFileStore(session);
export const sessionCookieName = 'hsmemberscookie.sid';

import { router as indexRouter } from './routes/index.mjs';
import { router as membersRouter, initPassport } from './routes/users.mjs';
import { router as membershipRouter } from './routes/membership.mjs';
import passport from 'passport';

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
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/membership', membershipRouter);
app.use('/members', membersRouter);

app.use(session({
    resave: false,
    // cookie: {
    //     maxAge: 1800000, // 30min
    //     secure: true // require https
    // },
    saveUninitialized: false,
    secret: process.env.SECRET_KEY,
    store: new FileStore({ path: "sessions"}),
    name: sessionCookieName
}));
initPassport(app);
app.use(passport.authenticate('session'))

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
