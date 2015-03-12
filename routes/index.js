var express = require('express');
var router = express.Router();
 
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  passport = require('passport'),
  ObjectId = mongoose.Types.ObjectId;



module.exports = function(passport){

    router.get('/', function(req, res) {
            // Display the Login page with any flash message, if any
            res.render('index', { 
                title: 'JMV' ,
                message: req.flash('message') 
            });
    });

    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash : true  
    }));

    router.get('/register', function(req, res) {
        res.render('index');
    });  
    /* Handle Registration POST */
    router.post('/signup', function (req, res, next) {
        console.log("signup called");

        var newUser = new User(req.body);

        console.log(newUser);
        newUser.provider = 'local';
        console.log("starting save1");
        newUser.save(function(err) {
            console.log("after save");
            if (err) {
              return res.json(400, err);
            }
                console.log("pre login");
            req.logIn(newUser, function(err) {
console.log("past login");

              if (err) return next(err);
              return res.json(newUser.user_info);
            });
        });
    });




    return router;
}
