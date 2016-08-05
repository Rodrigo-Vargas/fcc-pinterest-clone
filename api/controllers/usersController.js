var Helpers   = require('../helpers');
var User      = require('../models/user');
var Jwt       = require('jsonwebtoken');
var Config    = require('../../config/secret');

function UsersController () { }

UsersController.update = function(req, res) {
  var token = Helpers.getToken(req.headers);
  
  if (!token)
    return res.status(403).send({success: false, message: 'No token provided.'});

  var decoded = Jwt.decode(token, Config.secret);
  
  User.findOne({
    '_id': decoded._doc._id
  }, function(err, user) {
    if (err) 
      throw err;

    user.local.name  = req.body.user.name;
    user.local.email = req.body.user.email;
    if (req.body.user.password)
      user.local.password = user.generateHash(req.body.user.password);

    user.save();

    var updatedUser = {  
      name : user.getName(), 
      token : 'JWT ' + token,
      id :  user._id
    };

    return res.json({success: true, user : updatedUser });
  });
}

UsersController.login = function(req, res) {
  var query = { 'local.email': req.body.email };
  User.findOne(query, function(err, user) {
    if (err) 
      throw err;

    if (!user)
    {
      res.send({success: false, message: 'Authentication failed. User not found.'});
      return;
    } 
    
    if (!user.validPassword(req.body.password))
    {
      res.send({success: false, message: 'Authentication failed. Wrong password.'});
      return;
    }

    var token = Jwt.sign(user, Config.secret);
      
    var user =  {  
                  name : user.getName(), 
                  token : 'JWT ' + token,
                  id :  user._id
                };

    return res.json({ success: true, user: user });      
  });
}

UsersController.signup = function(req, res) {
  if (!req.body.email || !req.body.password)
    return res.json({success: false, message: 'Please pass email and password.'});
  
  var newUser = new User();
  newUser.local.name = req.body.email;
  newUser.local.email = req.body.email;
  newUser.local.password = newUser.generateHash(req.body.password);
  
  newUser.save(function(err) {
    if (err) {
      return res.json({success: false, message: 'Username already exists.'});
    }

    var token = Jwt.sign(newUser, Config.secret);

    var user =  { 
                  name : newUser.getName(), 
                  token : 'JWT ' + token,
                  id : newUser._id
                };

    return res.json({  success: true, 
                message: 'Successful created new user.',
                user : user });
  });  
}

UsersController.getCurrent = function(req, res) {
   var token = Helpers.getToken(req.headers);
  
  if (!token)
    return res.status(403).send({success: false, message: 'No token provided.'});

  var decoded = Jwt.decode(token, Config.secret);
  
  User.findOne({
    '_id': decoded._doc._id
  }, function(err, user) {
    if (err) 
      throw err;

    var currentUser = {
                        name : user.getName(),
                        email : user.local.email,
                        id : user._id,
                        token : 'JWT ' + token
                      }

    return res.json({success: true, user : currentUser });
  });
}

module.exports = UsersController;
