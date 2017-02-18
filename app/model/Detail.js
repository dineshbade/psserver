var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var DetailSchema = new Schema({

	title:{
		type:String,
		require:true
	},
	username:{
		type:String,
		require:true,
	},
	password:{
		type:String,
		require:true

	},
	createdAt:{
		type:Date,
		require:true
	}


});

module.exports = mongoose.model("detail",DetailSchema);