'use strict';
var express = require('express');
// var bodyParser = require('body-parser');
//var parseUrlEncoded = bodyParser.urlencoded({ extended: true });
var Prods = require('../models/prods.model');
//console.log(Prods);

// returens router instanace which can be mounted as a middleware
var router = express.Router();

// configure app
//var bodyParser = require('body-parser');
//var parseUrlencoded = bodyParser.urlencoded({
//	extended: false
//});
//app.use(bodyParser.urlencoded({extended:true}));
//app.use(bodyParser.json());

// the root path relative to the path where it's mounted.
router.route('/')
	// get all the users when a method passed is GET
	.get(function(req, res) {
		Prods.find(function(err, data) {
			if (err)
				res.send(err);
			res.status(200).json(data);
		})
	})
	// create a prod when the method passed is POST
	.post(function(req, res) {
		// create a new instance of the user model
		var data = new Prods(req.body); // Prods is a schema constructor
		//console.log(data);   

		// save the data received
		data.save(function(err) {
			if (err) {
				console.log(err);
				res.send(err);
				return;
			}
			// give some success message
			//console.log(data);
			res.status(201).json(data);
		})
	});

// on accessing user Route by id
router.route('/:id')
	// get the user by id
	.get(function(req, res) {
		Prods.findById(req.params.id, function(err, data) {
			if (err) {
				res.send(err);
				return;
			}
			res.status(200).json(data);
		})
	})
	// update the user by id
	.put(function(req, res) {
		/*
		console.log(req.params.user_id);
		Prods.findById(req.params.user_id, function(err, data) {
			if (err)
				res.send(err);

			// set the users properties (comes from the request)
			var data = new Prods(req.body); // Prods is a schema constructor		
		
			// save the data received
			data.save(function(err) {
				if (err)
					res.send(err);
				// give some success message
				//res.json(data);
				res.end();
			});
		})
		*/
		Prods.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
			console.log(req.body);
			if (err) return next(err);
			res.status(200).json(post);
		});
	})
	.delete(function(req, res) {
		console.log(req.params.id);
		Prods.remove({
			_id: req.params.id
		}, function(err, data) {
			if (err)
				res.send(err);
			// give some success message
			//res.sendStatus(200);
			res.status(200);
		})
	});

// exports the router as a Node module
module.exports = router;