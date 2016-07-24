var Helpers   = require('../helpers');
var User      = require('../models/user');
var Jwt       = require('jsonwebtoken');
var Config    = require('../../config/secret');

function UsersController () { }

UsersController.update = function(req, res) {
  var token = Helpers.getToken(req.headers);
  
  if (!token)
    return res.status(403).send({success: false, msg: 'No token provided.'});

  var decoded = Jwt.decode(token, Config.secret);
  
  User.findOne({
    '_id': decoded._doc._id
  }, function(err, user) {
    if (err) 
      throw err;

    user.local.name  = req.body.user.name;
    user.local.email = req.body.user.email;
    user.local.password = user.generateHash(req.body.user.password);

    user.save();

    return res.json({success: true});
  });
}

module.exports = UsersController;
