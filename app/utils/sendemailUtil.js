 var nodemailer = require("nodemailer");
/* var user = require("../model/user");
*/

 var smtpTransport = nodemailer.createTransport({
     service: "gmail",
     host: "smtp.gmail.com",
     auth: {
         user: "dineshbade1992@gmail.com",
         pass: "XXXXXX"
     }
 });
 module.exports = {
     sendEmailtoUser: function(randomNumber, user) {

         var mailOptions = {
             to: "dineshbade1992@gmail.com",
             subject: "noreply",
             text: 'Thank you ' + user.fullName + ' for registering passwordsaver\n' +
                 '	Please enter following verification code to activate your account\n' +
                 ' Verification code:' + randomNumber
         }

         smtpTransport.sendMail(mailOptions, function(error, response) {
             if (error) {
                 console.log(error);

             } else {
                 return true;
                 console.log("Message sent: " + response.message);
             }
         });

     }
 }