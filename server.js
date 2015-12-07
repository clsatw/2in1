process.env.NODE_ENV = process.env.NODE_ENV || 'development';	// has to be before config coz config reads it
var config = require('./server/config/config'),
	//bodyParser = require('body-parser'),   
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),	
	mongoose = require('mongoose'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	passport = require('passport'),
	flash = require('connect-flash');

var app = express();
require('./server/config/strategies/passport')(passport); // pass passport for configuration

// Parsing environment variables
var options = {};
options.port = process.env.port || 5000;

/*
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
	app.use(compress());
}
*/

//var parseUrlEncoded = bodyParser.urlencoded({ extended: false });
//app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser.json());
//app.use(methodOverride());

app.use(session({
	saveUninitialized: true,
	resave: true,
	secret: config.sessionSecret
}));

app.set('views', './views');
app.set('view engine', 'ejs');

var prods = require('./server/routes/prods');
var auth = require('./server/routes/auth');

//app.use(session({secret: 'ilovescotchscotchyscotchscotch'})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

app.use('/', express.static(__dirname + '/public'));
// telling browser to cache it
app.use('/', function(req, res, next) {
	res.setHeader('Cache-Control', 'public, max-age=31536000');
	next();
});

// router is mounted in a particular root url
app.use('/api/auth', auth);
app.use('/api/prods', prods);

mongoose.connect(config.db, function(err) {
	if(err) {
        console.error('connection error', err);
    } else {
        console.log('connection successful');
    }
});

app.listen(options.port, function(req, res) {
	console.info('Server running at http://localhost: ' + options.port);
});