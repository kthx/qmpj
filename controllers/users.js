'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  passport = require('passport'),
  ObjectId = mongoose.Types.ObjectId;

exports.create = function (req, res, next) {
    var newUser = new User(req.body);
    newUser.provider = 'qmpj';
    newUser.save(function(err) {
    if (err) {
      return res.json(400, err);
    }else{
        req.logIn(newUser, function(err) {
          if (err) return next(err);
          return res.json(newUser.user_info);
        });
    }
  });
};


exports.show = function (req, res, next) {
  var userId = req.params.userId;

  User.findById(ObjectId(userId), function (err, user) {
    if (err) {
      return next(new Error('Failed to load User'));
    }
    if (user) {
      res.send({username: user.username, profile: user.profile });
    } else {
      res.send(404, 'USER_NOT_FOUND')
    }
  });
};

exports.destroy = function(req, res) {
    var User = req.User;
    User.remove(function(err) {
    if (err) {
        console.log(err);
        res.json(500, err);
    } else {
        res.json(User);
    }
  });
};

exports.User = function(req, res, next, id) {
  User.load(id, function(err, User) {
    if (err) return next(err);
    if (!User) return next(new Error('Failed to load User ' + id));
    req.User = User;
    next();
  });
};

exports.exists = function (req, res, next) {
  var username = req.params.username;
  User.findOne({ username : username }, function (err, user) {
    if (err) {
      return next(new Error('Failed to load User ' + username));
    }

    if(user) {
      res.json({exists: true});
    } else {
      res.json({exists: false});
    }
  });
}