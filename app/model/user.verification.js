var mongoose = require('mongoose');
var user = require('./user');



var Schema = mongoose.Schema;
 var UserVerificationSchema=new Schema({
 		code:{
 			type:Number,
 			require:true
 		},
 		user:[{
 			type:Schema.Types.ObjectId,
 			ref:'user'
 		}]
 });

module.exports = mongoose.model("userverificationCode",UserVerificationSchema);