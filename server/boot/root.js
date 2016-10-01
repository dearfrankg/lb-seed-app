'use strict';

module.exports = function(server) {

  var User = server.models.user;

  var router = server.loopback.Router();

  router.get('/status', server.loopback.status());

  router.get('/', function (req, res) {
    res.render('home', { user: req.accessToken ? req.user : null });
  });

  router.get('/logout', function(req, res, next) {
    if (!req.accessToken) return res.sendStatus(401);
    User.logout(req.accessToken.id, function(err) {
      if (err) return next(err);
      res.redirect('/');
    });
  });

  server.use(router);
};
