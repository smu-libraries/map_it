/**
 * @file The application.
 */

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
let helmet = require('helmet');

let v1 = require('./lib/router');
v1.use_datastore(path.join(__dirname, 'data', 'datastore.json'));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/map_it/public', express.static(path.join(__dirname, 'public')));
app.use(helmet());

app.enable('trust proxy');
app.use((req, res, next) => {
  /** Azure removes the X-Forwarded-Proto header. */
  if (!req.headers['x-forwarded-proto'] && req.headers['x-arr-ssl']) req.headers['x-forwarded-proto'] = req.headers['x-arr-ssl'];

  return next();
});

app.use('/map_it', v1);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
