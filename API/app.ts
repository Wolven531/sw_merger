'use strict';

import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
// const favicon = require('serve-favicon');
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as request from 'request';

import { HomeRouter } from './routes/';
import { MonsterRouter } from './routes/monsters';
import { GeneratorRouter } from './routes/generator';
import { MonsterManager } from './lib/managers/MonsterManager';

const app = express();
const monMgr = new MonsterManager();
monMgr.init();

const homeRouter = new HomeRouter(monMgr);
const monRouter = new MonsterRouter(monMgr);
const generatorRouter = new GeneratorRouter(monMgr);

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// NOTE: awill could optimize this to only be used for OPTIONS
// and create another handler for GET, but since we need the origin
// header on both, we hack it for now by handling both here
app.use('/*', (req, res, next) => {
    // TODO: awill: check this for security
    // NOTE: allow localhost (and EVERYTHING else) to make requests
    // WARNING
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.use('/', homeRouter.router);
app.use('/monsters', monRouter.router_express);
app.use('/generator/', generatorRouter.router);

app.get('/heartbeat/', (req, res, next) => {
    const webApiUrl = 'http://127.0.0.1:4040/api/tunnels';
    const ngrokUrl = app.get('ngrokUrl');
    let returnVal = {
        webApi: webApiUrl,
        ngrokUrl: ngrokUrl,
        ngrokTunnelInfo: null,
        err: null,
    };

    const ngrokTunnelReqOpts = {
        method: 'GET',
        headers: {
            'Connection': 'keep-alive',
            'Accept': '*/*',
            'X-CSRF-Token': 'dmFPXLuems+XoeJWiMreQUlhJmtaeH7RTnklQ3u/1qbGTaKxgF5cgaRiIgkpNQVDzdxpHf/HGpIPzS1Cm3CaIw==',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3137.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'en-US,en;q=0.8',
        },
        uri: webApiUrl,
    };

    console.info('[heartbeat] making request for tunnel info');
    request(ngrokTunnelReqOpts, (error, resp, bodyBuffer) => {
        let tunnelInfo = resp.body;

        try {
            tunnelInfo = JSON.parse(tunnelInfo);
            // NOTE: remove unused property (replaced with webApiUrl)
            delete tunnelInfo.uri;
            // NOTE: only maintain HTTPS tunnel
            tunnelInfo.tunnels = tunnelInfo.tunnels.filter((currTunnel, ind, arr) => {
                return currTunnel.proto === 'https';
            });
        } catch (jsonErr) {
            console.warn('[heartbeat] failed to parse ngrok tunnel info, using raw info');
        }

        returnVal.ngrokTunnelInfo = tunnelInfo;

        return res.json(returnVal);
    });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    res.locals.status = 404;
    next(err);
});

// NOTE: error handler
app.use((err, req, res, next) => {
    if (res.locals.status !== 404) {
        console.log('Some error ocurred during processing...');
    }
    res.locals.message = err.message;
    res.locals.error =  err;
    res.status(res.locals.status || 500);
    res.json({ err: JSON.stringify(err) });
});

module.exports = app;
// TODO: awill: see if the below is necessary
export { app };