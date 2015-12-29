// set NODE_ENV environment variable at cmd prompt. e.g., set NODE_ENV = production 
// port defined in server/config/env/*.js file

process.env.NODE_ENV = process.env.NODE_ENV || 'development';	// has to be before config coz config reads it
var config = require('./server/config/config'),
	//bodyParser = require('body-parser'),   
	express = require('express'),
	morgan = require('morgan'),
	cookieParser = require('cookie-parser');
    bodyParser   = require('body-parser');
	compress = require('compression'),	
	mongoose = require('mongoose'),
	//methodOverride = require('method-override'),
	session = require('express-session'),
	passport = require('passport'),
	flash = require('connect-flash');

mongoose.connect(config.db, function(err) {
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
	app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
	app.use(compress());
}

// set up our express application
app.use(cookieParser()); // read cookie (needed for auth)
app.use(bodyParser.urlencoded({extended: true})); // get info form htlm form

//var parseUrlEncoded = bodyParser.urlencoded({ extended: false });
//app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//app.use(methodOverride());

app.use(session({
	saveUninitialized: true,
	resave: true,
	secret: config.sessionSecret
}));

// view engine setup
app.set('views', './views');
//app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(facicon(__dirname + '/public/favicon.ico'));

var prods = require('./server/routes/prods');
// here we pass in passport as the param, so there is no need to require passport in auth.js
var auth = require('./server/routes/auth')(passport);
var paypal = require('./server/routes/paypal.js');

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
app.use('/', express.static(__dirname + '/public'));
// telling browser to cache it
app.use('/', function(req, res, next) {
	res.setHeader('Cache-Control', 'public, max-age=31536000');
	next();
});

// router is mounted in a particular root url
app.use('/api/auth', auth);
app.use('/api/prods', prods);
app.use('/paypal', paypal);


app.listen(config.port, function(req, res) {
	console.info('Server running at http://localhost: ' + config.port);
});
