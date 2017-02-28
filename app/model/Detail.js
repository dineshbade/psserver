var mongoose = require('mongoose');
var user = require('./user');

var Schema = mongoose.Schema;
var DetailSchema = new Schema({

	type:{
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
	},
	user:[{type:Schema.Types.ObjectId,ref:'user'}]


});

module.exports = mongoose.model("detail",DetailSchema);