var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
var mongoose = require('mongoose');
var morgan = require('morgan');
var jwt = require('jwt-simple');
var moment = require('moment');


var app =express();
app.set('port', process.env.PORT || 3000);
var api=require('./app/route/api');
var config= require('./config');

/*app.use(function(req,res,next){
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Custom-Header");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
});*/
// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(function log (req, res, next) {
  console.log(req.method, req.url,req.body );
  next();
});
//Connection to database
mongoose.connect(config.MONGO_URI,function(error){
	if(error){
		console.log(error);
	}else{
		console.log("connected to database");
	}
});

//set our api route
app.use('/api',api);

app.on('request',function(req,res){
    console.log(request.method);
    console.log(request.headers);
    console.log(request.url);
})

 app.listen("3000","192.168.1.8",function(error){
	if(error){
		console.log("ERROR");
	}else{
		console.log("Listenning at port 3000");
	}
});