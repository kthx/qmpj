var express = require('express');
var fs = require('fs');
var http = require ('http');
var mongoose = require ("mongoose"); 
var multer  = require('multer');
var session = require('express-session');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoStore = require('connect-mongo')(session);
var passport = require('passport');
var fs = require('fs');
var path = require('path');
var methodOverride = require('method-override');

var app = express();

var dbInit = require('./config/db');
var db = dbInit.db;
var dbConfig = dbInit.dbConfig;

// Bootstrap models
require('./models/project.js');
require('./models/user.js');


var config = require('./config/config');
var app = express();


// Configuring Passport
var pass = require('./config/pass');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');
app.set('view options', {
    layout: false
});


app.use(cookieParser());


app.use(multer({ dest: './temp/'}));
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser( { keepExtensions: true, uploadDir: './temp/' } ));
app.use(methodOverride('X-HTTP-Method-Override'));


app.use(session({
    secret: '5Gu3Ig§h4S%BDs/§&§d%U',
    store: new mongoStore({
        url: config.db,
        collection: 'sessions'
    }),
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); 


//Bootstrap routes
require('./config/routes')(app);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
