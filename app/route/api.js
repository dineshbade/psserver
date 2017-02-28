const express = require('express');
const router = express.Router();
var Detail = require("../model/detail");
var User = require("../model/user");
var config = require("../../config");
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var multer = require('multer');
var fs = require("fs");
 var UserVerifcationCode = require('../model/user.verification');
 var sendEmail =require('../utils/sendemailUtil');
var gcm = require('node-gcm');
var gcmApiKey = 'AIzaSyD92Gq8O5LbIjCct4qhl1JQjImnFaanfZE'; // GCM API KEY OF YOUR GOOGLE CONSOLE PROJECT


/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
    var payload = {
        sub: {
            id: user.id,
            fullName: user.fullName,
            email: user.email
        },
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}

router.get('/', function(req, res) {
    res.json({status:200});
});


/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
function ensureAuthenticated(req, res, next) {
    if (!req.header('Authorization')) {
        return res.status(401).send({
            message: 'Please make sure your request has an Authorization header'
        });
    }
    var token = req.header('Authorization').split(' ')[1];
    var payload = null;
    try {
        payload = jwt.decode(token, config.TOKEN_SECRET);

    } catch (err) {
        return res.status(401).send({
            message: err.message
        });
    }

    if (payload.exp <= moment().unix()) {
        return res.status(401).send({
            message: 'Token has expired'
        });
    }
    req.user = payload.sub;
    next();
}

//Generate random number

function generateRandomNumber(){
    var min=10000;
    var max=99999;
    return Math.floor(Math.random()*(max-min+1))+min;
}

router.get('/push', function (req, res) {
    var device_tokens = []; //create array for storing device tokens
    
    var retry_times = 4; //the number of times to retry sending the message if it fails
    var sender = new gcm.Sender(gcmApiKey); //create a new sender
    var message = new gcm.Message(); //create a new message
    message.addData('title', 'PushTitle');
    message.addData('message', "Push message");
    message.addData('sound', 'default');
    message.collapseKey = 'Testing Push'; //grouping messages
    message.delayWhileIdle = true; //delay sending while receiving device is offline
    message.timeToLive = 3; //number of seconds to keep the message on 
    //server if the device is offline
    
    //Take the registration id(lengthy string) that you logged 
    //in your ionic v2 app and update device_tokens[0] with it for testing.
    //Later save device tokens to db and 
    //get back all tokens and push to multiple devices
    device_tokens[0] = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
    sender.send(message, device_tokens[0], retry_times, function (result) {
        console.log('push sent to: ' + device_tokens);
        res.status(200).send('Pushed notification ' + device_tokens);
    }, function (err) {
        res.status(500).send('failed to push notification ');
    });
});
/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
router.post('/auth/signup', function(req, res) {

    User.findOne({
        email: req.body.email.toLowerCase()
    }, function(err, existingUser) {
        if (existingUser) {
            return res.json({
                stauts: 409,
                message: 'Email is already taken'
            });
        }
        var user = new User({
            fullName: req.body.fullName,
            email: req.body.email.toLowerCase(),
            password: req.body.password,
            createdAt: new Date()
        });
        console.log(user);
        user.save(function(err, result) {
            if (err) {
                res.status(500).send({
                    message: err.message
                });
            }

            var vfCode=generateRandomNumber();
            var userVfCode= new UserVerifcationCode({
                code:vfCode,
                user:result
            }) ;
        userVfCode.save(function(error,result){
            if(error){
                console.log(error);
            }else if(result){
                /*sendEmail.sendEmailtoUser(vfCode,user);*/
                console.log("send email function later un comment");


               res.json({
                status: 201,
                message: "user created"
            });
            }
        })

            
        });
    });
});


/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */
router.post('/auth/signin', function(req, res) {
    User.findOne({
        email: req.body.email.toLowerCase()
    }, '+password', function(err, user) {
        if (!user) {
            return res.json({
                status: 401,
                success: false,
                message: 'Invalid email '
            });
        }
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (!isMatch) {
                return res.json({
                    status: 401,
                    success: false,
                    message: 'Invalid email and/or password'
                });
            }
            console.log(user);
             /*if(user.activated ===false){
                console.log("check activated")
                return res.json({
                    status:200,
                    success:true,
                    message:"not activated check mail"
                });
            }*/
            return res.json({
                status: 200,
                token: createJWT(user),
                success: true,
                message: 'login success'
            });
        });
    });
});

// File input field name is simply 'file'

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        console.log(file.originalname);
        var ext = require('path').extname(file.originalname);
        ext = ext.length > 1 ? ext : "." + require('mime').extension(file.mimetype);
        require('crypto').pseudoRandomBytes(16, function(err, raw) {
            cb(null, (err ? undefined : raw.toString('hex')) + ext);
        });
    }
});

var upload = multer({
    storage: storage
});

router.post('/picture', upload.any(), function(req, res, next) {
    console.log("here");
    console.log(req.files);
    res.send(req.files);
})

router.get('/me', ensureAuthenticated, function(req, res) {
    console.log("here at ME");
    res.send("send");
});


router.get('/details', ensureAuthenticated, function(req, res) {
    User.findById(req.user.id, function(error, user) {
        if (error)
            console.log(error);
        else {
            Detail.find({
                user: user
            }, function(error, details) {
                if (error)
                    res.json({
                        status: 409,
                        success: false,
                        message: error.message
                    })
                else {
                    res.json({
                        status: 200,
                        success: true,
                        result: details
                    });
                }
            })
        }
    })
})

router.delete('/detail/:id', ensureAuthenticated, function(req, res) {
    var id = req.params.id;

    console.log(id);
    Detail.remove({
        _id: req.params.id
    }, function(error, result) {
        if (error)
            res.json({
                success: false,
                status: 500,
                message: error.message
            })
        else {
            res.json({
                success: true,
                status: 200,
                message: "delete success"
            });

        }
    })
})
router.get('/alldetail', function(req, res) {
    Detail.find({}, function(error, details) {
        if (error) {
            res.send(error);
            return;

        }
        res.json(details);
    });
});



router.post('/detail', ensureAuthenticated, function(req, res) {


    User.findById(req.user.id, function(error, user) {
        if (error) {
            console.log(error);
            return;
        } else if (user) {
            var detail = new Detail();

            detail.type = req.body.type,
                detail.username = req.body.username,
                detail.password = req.body.password,
                detail.createdAt = new Date()
            detail.user = user;
            console.log(detail);


            detail.save(function(error, result) {
                if (error) {
                    res.send({
                        status: 500,
                        success: false,
                        error: error.message
                    });
                    return;
                }
                res.json({
                    status: 201,
                    success: true,
                    result: result
                });
            });


        }




    });

})




module.exports = router;