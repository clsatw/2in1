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

// =====================================
// HOME PAGE (with login links) ========
// =====================================
//router.route('/').get(function(req, res) {
//    res.sendFile(__dirname + '/auth.html'); // load the index.ejs file
    //res.render('auth.ejs');
//});

// call login strategy with login api
router.post('/login', 
    passport.authenticate('local-login'), 
    function(req, res){
        res.send(req.user);
    }    
);

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
