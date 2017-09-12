'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// set up API location - on Bluemix this is set in the environment variables
app.set('api path', process.env.API_PATH || 'http://localhost:3000');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// this section defines how requests are routed based on their URL
// e.g. a URL beginning with /users is routed to the module at ./routes/users.js
app.use('/', require('./routes/index'));
app.use('/Transaction', require('./routes/Transaction'));
app.use('/trx', require('./routes/UserTransaction'));
app.use('/LandTitle', require('./routes/LandTitle'));
app.use('/SalesAgreement', require('./routes/SalesAgreement'));
app.use('/Person', require('./routes/Person'));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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
