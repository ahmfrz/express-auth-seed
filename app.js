/**
 * Main module which installs middlewares
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var helmet = require('helmet');
var admin = require('sriracha');
var log4js = require('log4js');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');

var webconfig = require('./config/web.config');
var auth = require('./auth/auth-strategy');

var logger = log4js.getLogger('app');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

// create express app
var app = express();

// configure middlewares
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use('/admin', admin());
app.use(favicon());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: webconfig.SECRET }));
app.use(passport.initialize());
app.use(passport.session());

// connect to the database
mongoose.connect(webconfig.CONNECTION_STRING);

// configure auth
auth.configure(webconfig);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    logger.error("Something went wrong", err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // return the error
    res.status(err.status || 500);
    res.end(err.status);
});

module.exports = app;