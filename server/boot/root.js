'use strict';

module.exports = function(server) {

  var User = server.models.user;

  var router = server.loopback.Router();

  router.get('/status', server.loopback.status());

  router.get('/', function (req, res) {
    res.render('pages/index', { user: req.accessToken ? req.user : null });
  });

  router.get('/signup', function (req, res) {
    res.render('pages/signup', { user: req.accessToken ? req.user : null });
  });

  router.post('/signup', function (req, res) {
    res.render('pages/index', { user: req.accessToken ? req.user : null });
  });

  router.get('/signin', function (req, res) {
    res.render('pages/signin', { user: req.accessToken ? req.user : null });
  });

  router.get('/signout', function(req, res, next) {
    if (!req.accessToken) return res.sendStatus(401);
    User.logout(req.accessToken.id, function(err) {
      if (err) return next(err);
      res.redirect('/');
    });
  });

  server.use(router);
};
