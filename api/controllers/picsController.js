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

PicsController.all = function(req, res) {
  var token = Helpers.getToken(req.headers);
  
  Pic.find({})
 .populate('owner', 'local.name _id')
 .exec(function(err, pics) {
    return res.json({success: true, pics : pics});
  });
}

PicsController.fromUser = function(req, res) {
  var token = Helpers.getToken(req.headers);
  
  Pic.find({ owner : req.params.userId })
 .populate('owner')
 .exec(function(err, pics) {
    return res.json({success: true, pics : pics});
  });
}

PicsController.destroy = function(req, res) {
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
    
    Pic.find({ _id: req.params.picId }).remove().exec(function (err, book) {
      if (err) 
        throw err;
      
      return res.json({success: true});
    });    
  });
}

module.exports = PicsController;