var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
var mongoose = require('mongoose');
var morgan = require('morgan');


var app =express();

var api=require('./app/route/api');
var config= require('./config');


// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Connection to database
mongoose.connect(config.database,function(error){
	if(error){
		console.log(error);
	}else{
		console.log("connected to database");
	}
});

//set our api route
app.use('/api',api);



 app.listen(config.port,function(error){
	if(error){
		console.log("ERROR");
	}else{
		console.log("Listenning at port 3000");
	}
});