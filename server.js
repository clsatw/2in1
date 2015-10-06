process.env.NODE_ENV = process.env.NODE_ENV || 'development';	// has to be before config coz config reads it
var config = require('./config/config'),
   
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	passport = require('passport'),
	flash = require('connect-flash');

var app = express();
require('./config/strategies/passport')(passport); // pass passport for configuration

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
	app.use(compress());
}

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
//app.use(methodOverride());

app.use(session({
	saveUninitialized: true,
	resave: true,
	secret: config.sessionSecret
}));

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static('./public'));

var prods = require('./routes/prods');
var auth = require('./routes/auth');

//app.use(session({secret: 'ilovescotchscotchyscotchscotch'})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

//require('../app/routes/users.server.routes.js')(app);
app.use('/api/auth', auth);
app.use('/api/prods', prods);

mongoose.connect(config.db);
// Check if MongoDB is running
mongoose.connection.on('error', function() {
	console.error('error: %s, MongoDB Connection Error. Make sure MongoDB is running. ', error);
});

app.listen(3000, function(req, res) {
	console.log('Server running at http://localhost:3000/');
});