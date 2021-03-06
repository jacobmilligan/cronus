'use strict';

var express = require('express');
var app = express();

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var csrf = require('csurf'); //must come after express-session
var hbs = require('hbs');
var flash = require('connect-flash');
var pgSession = require('connect-pg-simple')(session);
var pg = require('pg');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session( {
    store: new pgSession({
      pg: pg,
      conString: process.env.DATABASE_URL || 'postgres://localhost:5432/cronus',
      tableName: 'session'
    }),
    secret: 'c7898789r907890o876098n86758u8098098s',
    resave: false,
    saveUninitialized: false,
    rolling: true
  }
));

app.use(flash());

// Set locals, must come before csrf call
app.use(function(req, res, next) {
  if (req.session.user) {
    res.locals.loggedIn = true;
  }
  next();
});

app.use( csrf() );

// Get defined routes
require('./config/router')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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
