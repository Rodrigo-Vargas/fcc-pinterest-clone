var UsersController       = require(process.cwd() + '/api/controllers/usersController.js');
var TwitterAuthController = require(process.cwd() + '/api/controllers/twitterAuthController.js');
var PicsController        = require(process.cwd() + '/api/controllers/picsController.js');

module.exports = function (app) {
  app.get('/api/login/callback', TwitterAuthController.callback);

  app.get('/auth/twitter', TwitterAuthController.login);

  app.post('/api/users/update', UsersController.update);

  app.post('/api/pics/add', PicsController.add)

  app.get('/api/pics/all', PicsController.all);

  app.get('/api/pics/user/:userId', PicsController.fromUser);

  app.post('/api/pics/destroy/:picId', PicsController.destroy);

  app.post('/api/signup', UsersController.signup);

  app.post('/api/login', UsersController.login);

  app.get('*', function(req, res) {
    res.sendfile('./app/index.html');
  });
};
