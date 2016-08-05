var Jwt           = require('jsonwebtoken');
var User          = require('../models/user');
var Config        = require('../../config/secret');
var Request       =  require("request");
var OAuth         = require('oauth-1.0a');

function TwitterAuthController () { }

TwitterAuthController.login = function(req, res){
  var oauth = OAuth({
    consumer: {
      public: process.env.TWITTER_KEY,
      secret: process.env.TWITTER_SECRET
    },
    signature_method: 'HMAC-SHA1'
  });

  var request_data = {
    method: 'POST',
    url: 'https://api.twitter.com/oauth/request_token'
  }

  var options = { 
    method: request_data.method,
    url: request_data.url,
    headers: oauth.toHeader(oauth.authorize(request_data))
   }

  Request(options, function (error, response, body) {
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
  var oauth = OAuth({
    consumer: {
      public: process.env.TWITTER_KEY,
       secret: process.env.TWITTER_SECRET
    },
    signature_method: 'HMAC-SHA1'
  });

  var requestData = {
    method: 'POST',
    url: 'https://api.twitter.com/oauth/access_token',
    data : { oauth_verifier: req.query.oauth_verifier }
  }

  var token = {
                public : req.query.oauth_token,
                secret : req.query.oauth_verifier
              }

  var options = { 
    method : requestData.method,
    url: requestData.url,
    headers: oauth.toHeader(oauth.authorize(requestData, token)),
    form : requestData.data
  }

  Request(options, function (error, response, body) {
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

          newUser.save();

          var token = Jwt.sign(newUser, Config.secret);
          
          return res.redirect('/settings/' + token + '/' + screenName + '/' + newUser._id);
        }
      }
    );
  });
}


module.exports = TwitterAuthController;