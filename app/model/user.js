var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Detail = require('./detail');


var Schema = mongoose.Schema;
var UserSchema = new Schema({
	fullName:String,

	email:{
		type:String,
		require:true
	},
	password:{
		type:String,
		require:true,
		select:false

	},

	
	createdAt:{
		type:Date,
		require:true
	},
	activated:{
		type:Boolean,
		default:false

	}

	/*,
	detail:[{type:Schema.Types.ObjectId,
		ref:'detail'
	}]*/


});
	UserSchema.pre('save', function(next) {
	  var user = this;
	  if (!user.isModified('password')) {
	    return next();
	  }
	  bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(user.password, salt, function(err, hash) {
	      user.password = hash;
	      next();
	    });
	  });
	});

	UserSchema.methods.comparePassword = function(password, done) {
	  bcrypt.compare(password, this.password, function(err, isMatch) {
	    done(err, isMatch);
	  });
	};

module.exports = mongoose.model("user",UserSchema);