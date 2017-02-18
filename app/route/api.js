const express = require('express');
const router = express.Router();
var Detail = require("../model/detail");




router.get('/',function(req,res){
	res.send('api works');
});

router.get('/details',function(req,res){
	Detail.find({},function(error,details){
		if(error){
			res.send(error);
			return;

		}
		res.json(details);
	});
});
router.post('/detail',function(req,res){

	var detail = new Detail({
		title:req.body.title,
		email:req.body.email,
		password:req.body.password,
		createdAt:new Date()
	});


	detail.save(function(error,result){
		if(error){
			res.status(500).send({error:error.message});
			return;
		}
		res.json({
			result
		});
	});


});

module.exports = router;
