var AuthConfig    = require(process.cwd() + '/config/auth')
var Jwt           = require('jsonwebtoken');
var User          = require('../models/user');
var Config        = require('../../config/secret');

function TwitterAuthController () { }

TwitterAuthController.login = function(req, res){
  var request = require("request");

  var options = { 
    method: 'POST',
    url: 'https://api.twitter.com/oauth/request_token',
    headers: 
    { 
      'cache-control': 'no-cache',
      'authorization': 'OAuth  oauth_consumer_key="' + AuthConfig.twitter.consumerKey + '",'
                            + 'oauth_signature_method="HMAC-SHA1",'
                            + 'oauth_timestamp="' + AuthConfig.twitter.timestamp + '",'
                            + 'oauth_nonce="DtOesU",'
                            + 'oauth_version="1.0",'
                            + 'oauth_signature="' + AuthConfig.twitter.signature + '"' 
    }        
   };

  request(options, function (error, response, body) {
    if (error) 
      throw new Error(error);

    var pattern = /oauth_token=(.+)&oauth_token_secret=(.+)&oauth_callback_confirmed=true/; 
    var results = pattern.exec(body);

    var oAuthToken = results[1];
    var oAuthSecret = results[2];

    res.redirect('https://api.twitter.com/oauth/authenticate?oauth_token=' + oAuthToken);
  });
}

TwitterAuthController.callback = function(req, res){
  var request = require("request");

  var options = { method: 'POST',
    url: 'https://api.twitter.com/oauth/access_token',
    headers: 
     { 'postman-token': '2e15fd36-67d0-a9ad-cd3b-e6fdec1e46d7',
       'cache-control': 'no-cache',
       'authorization': 'OAuth oauth_consumer_key="' + AuthConfig.twitter.consumerKey + '",'
       + 'oauth_token="' + req.query.oauth_token + '",'
       + 'oauth_signature_method="HMAC-SHA1",'
       + 'oauth_timestamp="' + Math.floor(new Date().getTime() / 1000) + '",'
       + 'oauth_nonce="QmMmNI",'
       + 'oauth_version="1.0",'
       + 'oauth_signature="cX0TO3xlkatnMvx%2BEv6pdoU7Tbk%3D"',
       'content-type': 'multipart/form-data; boundary=---011000010111000001101001' },
    formData: { oauth_verifier: req.query.oauth_verifier } };

  request(options, function (error, response, body) {
    if (error) 
      throw new Error(error);

    var pattern = /oauth_token=(.+)&oauth_token_secret=(.+)&user_id=(.+)&screen_name=(.+)&x_auth_expires=0/;
    var results = pattern.exec(body);

    var oAuthToken = results[1];
    var oAuthSecret = results[2];
    var userId = results[3];
    var screenName = results[4];

    User.findOne(
      { 'twitter.id' : userId }, 
      function(err, user) {
        if (err)
          return res.json({success: false });

        if (user)
        {
          var token = Jwt.sign(user, Config.secret);
          return res.redirect('/twitterCallback/' + token);
        }
        else
        {
          var newUser = new User();
          newUser.local.name = screenName;
          newUser.local.email = "";

          var token = Jwt.sign(newUser, Config.secret);
          
          return res.redirect('/settings/' + token + '/' + screenName + '/' + newUser._id);
        }
      }
    );
  });
}


module.exports = TwitterAuthController;