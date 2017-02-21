var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var UserSchema = new Schema({

	local:{

		username:{
		type:String,
		require:true,
		unique:true
	},
	password:{
		type:String,
		require:true,
		selected:false

	}
	},
	facebook:{
		facebook_id:{
			type:String,
			unique:true
		},
		facebook_token:{
			type:String,
			unique:true
		}

	}
	
	createdAt:{
		type:Date,
		require:true
	}


});

module.exports = mongoose.model("user",UserSchema);