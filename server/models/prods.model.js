var mongoose = require('mongoose');

var prodSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		default: ''
	},	
	description: {
		type: String
	},
	category: {
		type: String,
		required: true,
		default: ''
	},
	imgUrl: {
		type: String,
		default: ''
	},
	price: {
		type: String,
		default: ''
	}
	//description:    { type: String, default: '' },
	//picture:        { type: String, default: '' },   
});

// use the schema instance to define your Prods model
/* Mongoose automatically looks for the plural version of your model name. Thus, for the example above, the model user is for the users collection in the database.
 */
module.exports = mongoose.model('Prods', prodSchema);