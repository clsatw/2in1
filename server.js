// set NODE_ENV environment variable at cmd prompt. e.g., set NODE_ENV = production 
// port defined in server/config/env/*.js file

process.env.NODE_ENV = process.env.NODE_ENV || 'development';	// has to be before config coz config reads it
var config = require('./server/config/config');	
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var	compress = require('compression');	
var	mongoose = require('mongoose');
	// may be i should use multer - figure it out later
	//methodOverride = require('method-override'),
var	session = require('express-session');
var	passport = require('passport');
var	path = require('path');	
var	favicon = require('serve-favicon');
var	errorHandler = require('errorhandler');
var	flash = require('connect-flash');

// for routing
var prods = require('./server/routes/prods');
// here we pass in passport as the param, so there is no need to require passport in auth.js
var auth = require('./server/routes/auth')(passport);
var paypal = require('./server/routes/paypal');

mongoose.connect(config.db, {safe: true}, function(err) {
	if(err) {
        console.error('connection error', err);
    } else {
        console.log('connection successful');
    }
});

var app = express();
//require('./server/config/strategies/passport')(passport); // pass passport for configuration

// Parsing environment variables
// var options = {};

if (process.env.NODE_ENV === 'development') {
	// logging request details
	app.use(logger('dev'));
	app.use(errorHandler());
} else if (process.env.NODE_ENV === 'production') {
	app.use(compress());
}

app.use(favicon(__dirname + '/public/favicon.ico'));
// set up our express application
app.use(cookieParser()); // read cookie (needed for auth)
// app.use(bodyParser.urlencoded({extended: false})); // get info form htlm form

//var parseUrlEncoded = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//app.use(methodOverride());

app.use(session({
	saveUninitialized: true,
	resave: true,
	secret: config.sessionSecret
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
// app.use(facicon(__dirname + '/public/favicon.ico'));



// required for passport
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
// init passport
var initPassport = require('./server/config/strategies/passport-init');
initPassport(passport);
// use connect-flash for flash msg stored in session
app.use(flash());

/*
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
*/ 

// do i need to insert bodyParser, urlencoded and cokkieParser here? figure it out
app.use('/', express.static(path.join(__dirname, 'public')));
// telling browser to cache it
app.use('/', function(req, res, next) {
	res.setHeader('Cache-Control', 'public, max-age=31536000');
	next();
});

// router is mounted in a particular root url
app.use('/api/auth', auth);
app.use('/api/prods', prods);
app.use('/paypal', paypal);

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

app.listen(config.port, function(req, res) {
	console.info('Server running at http://localhost: ' + config.port);
});
