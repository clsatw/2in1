'use strict';

var express = require('express');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var uuid = require('node-uuid');
var PayPal = require('../lib/index');

// TODO: Put your PayPal settings here:
//var returnUrl = 'http://localhost:5000/paypal/success';
var returnUrl = 'https://www.paypal.com/checkoutnow/';
var cancelUrl = 'http://localhost:5000/paypal/cancel';
console.log(returnUrl);

var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser 
var urlencodedParser = bodyParser.urlencoded({ extended: false });

process.env.API_USERNAME = 'sdk-three_api1.sdk.com';
process.env.API_PASSWORD = 'QFZCWN5HZM8VBG7Q';
process.env.API_SIGNATURE = 'A-IzJhZZjhg29XQ2qnhapuwxIDzyAZQ92FRP5dqBzVesOkzbdUONzmOU';

module.exports = function(){
	var router = express.Router();
	/**
	 * React to pay POST. This will create paypal pay url and redirect user there. 
	 * @param  {[type]} req  [description]
	 * @param  {[type]} res) {}          [description]
	 * @return {[type]}      [description]
	 */
	// the root path relative to the path where it's mounted.
	router.route('/pay').post(urlencodedParser, function(req, res) {
		// create paypal object in sandbox mode. If you want non-sandbox remove tha last param.
		var paypal = PayPal.create(process.env.API_USERNAME, process.env.API_PASSWORD, process.env.API_SIGNATURE, true);
		var cart = req.body;
		console.log(cart.amt);
		/*
		var o = {};
		o = req.body.cart;
		for (var i=0; i < o.length; i++)
			console.log(o[i]);
		*/
		paypal.setPayOptions('Markie Store', null, process.env.logoImage, '00ff00', 'eeeeee');
	/*	we don't set products so paypal won't compare orders and payment's qty and amt.
		paypal.setProducts([{ 
			name: 'ACME Drill', 
			//description: 'Amazing drill', 
			quantity: cart.qty, 
			amount: cart.amt/cart.qty
		}]);
	*/
		// Invoice must be unique.
		var invoice = uuid.v4();
		paypal.setExpressCheckoutPayment(
			'test@email.com', 
			invoice, 
			cart.amt, 
			'Thanks for placing your order.',
			'TWD', 
			returnUrl, 
			cancelUrl, 
			false,
			function(err, data) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
				return;
			}
			console.log(data.redirectUrl);
			// Regular paid.
			res.redirect(data.redirectUrl);
			//res.status(200).send('<html><body></body><script>window.location.href=%s</script></html>', data.redirectUrl);
		});
	});

	router.route('/cancel').get(function(req, res) {
		// Cancel payment.
		res.send('Payment canceled');
	});

	router.route('/success').get(function(req, res) {
		var paypal = PayPal.create(process.env.API_USERNAME, process.env.API_PASSWORD, process.env.SIGNATURE, true);
		paypal.getExpressCheckoutDetails(req.query.token, true, function(err, data) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
				return;
			}

			// Check token and details.
			var resObj = JSON.stringify(data);
			res.send('../Successfuly payment, ' + resObj);
		});
	});
		
	/* catch 404 and forwarding to error handler
	app.use(function(req, res) {
		res.status(404).send('Unknown page');
	});
	*/
	// exports the router as a Node module
	return router;
}