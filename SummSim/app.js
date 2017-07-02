'use strict';

const express = require('express');
const logger = require('morgan');
const path = require('path');
// const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const routeMonsters = require('./routes/monsters');

const app = express();

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
app.use('/*', function(req, res, next) {
    // TODO: awill: check this for security
    // NOTE: allow localhost (and EVERYTHING else) to make requests
    // WARNING
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.use('/', index);
app.use('/monsters/', routeMonsters);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// NOTE: error handler
app.use(function(err, req, res, next) {
    // NOTE: set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // NOTE: render the error page
    res.status(err.status || 500);
    res.json({ error: JSON.stringify(err) });
});

module.exports = app;
