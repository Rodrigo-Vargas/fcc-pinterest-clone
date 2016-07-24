var Helpers   = require('../helpers');
var Jwt       = require('jsonwebtoken');
var Config    = require('../../config/secret');
var User      = require('../models/user');
var Pic      = require('../models/pic');

function PicsController () { }

PicsController.add = function(req, res) {
  var token = Helpers.getToken(req.headers);

  if (!token)
    return res.status(403).send({success: false, msg: 'No token provided.'});

  var decoded = Jwt.decode(token, Config.secret);

  User.findOne({
    '_id': decoded._doc._id
  }, function(err, user) {
    if (err) 
      throw err;

    if (!user)
      return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
    
    var pic = new Pic( { 
                            owner : user._id,
                            url : req.body.image.url });
    
    pic.save(function(err){
      if (err) 
        throw err;
      res.json({success: true});
    })    
  });  
}

module.exports = PicsController;