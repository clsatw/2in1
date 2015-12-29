'use strict';

var express = require('express');
// var passport = require('passport');
// required for passport
//var app = express();
// return router instance which can be mounted as a middleware.
var router = express.Router();

module.exports = function(passport){

var userProfile = {};
var baseUri = '/api/auth/';
var opts = {
    successRedirect: baseUri + 'success',
    failureRedirect: baseUri + 'failure'        
}
// configure app
//var bodyParser = require('body-parser');
//var parseUrlencoded = bodyParser.urlencoded({
//extended: false
//});

// =====================================
// HOME PAGE (with login links) ========
// =====================================
//router.route('/').get(function(req, res) {
//    res.sendFile(__dirname + '/auth.html'); // load the index.ejs file
    //res.render('auth.ejs');
//});

// process the login form
// app.post('/login', do all our passport stuff here);
// call login strategy with login api
router.post('/login', passport.authenticate('local-login', {
    function(req, res){
        res.send(req.user);
    }    
}));

// process the signup form
// app.post('/signup', do all our passport stuff here);
router.post('/signup',
    passport.authenticate('local-signup'),
    function(req, res){
        res.send(req.user);
    }    
);
/*
router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: baseUri + 'success', // redirect to the secure profile section
        failureRedirect: baseUri + 'failure', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
}));
*/
// sends successful Login state back to angular
router.get('/success', function(req, res){
    //console.log('go this far');
    res.send({state: 'success', user: req.user ? req.user : null});
});
// sends failure Login state back to angular
router.get('/failure', function(req, res){
    res.send({state: 'failure', user: null, message: 'Invalid username or password'});
});
// =====================================
// PROFILE SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
/* we will use route middleware to verify this (the isLoggedIn function)
router.route('/profile').get(isLoggedIn, function(req, res) {
    userProfile = req.user;
    //console.log(req.user.google);
    //res.sendFile(__dirname + '/profile.html');  // __driname = routers
    res.redirect('/#/getUserProfile');
    /*
    res.render('profile.html', {
        user: req.user // get the user out of session and pass to template        
    });
    */
//});
/*
router.route('/getUserProfile').get(function(req, res) {
    console.log(userProfile);
    res.json(userProfile);
});
*/

// route for facebook authentication and login
router.route('/facebook').get(passport.authenticate('facebook', {
    scope: 'email'
}));

// handle the callback after facebook has authenticated the user
router.route('/facebook/callback').get(
    passport.authenticate('facebook', {
        successRedirect: baseUri + 'profile',
        failureRedirect: baseUri
    }));

// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
router.route('/google').get(passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// the callback after google has authenticated the user
router.route('/google/callback').get(
    passport.authenticate('google', opts)); // redirect to success or failure

// =====================================
// LOGOUT ==============================
// =====================================
router.route('/logout').get(function(req, res) {
    req.logout();   // func provided by passport
    res.redirect('/');  // back to store
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect(baseUri);
};
// Express use function for routers expect to have a router obj back.
return router;
}
