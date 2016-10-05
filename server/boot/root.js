'use strict';

module.exports = function(server) {

  var User = server.models.user;

  var router = server.loopback.Router();

  router.get('/status', server.loopback.status());

  router.get('/', function (req, res) {
    res.render('pages/index', { user: req.user });
  });

  router.get('/signup', function (req, res) {
    res.render('pages/signup', { user: req.accessToken ? req.user : null });
  });

  router.post('/signup', function (req, res) {
    var newUser = {};
    newUser.email = req.body.email.toLowerCase();
    newUser.username = req.body.username.trim();
    newUser.password = req.body.password;

    User.create(newUser, function(err, user) {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      } else {
        // Passport exposes a login() function on req (also aliased as logIn())
        // that can be used to establish a login session. This function is
        // primarily used when users sign up, during which req.login() can
        // be invoked to log in the newly registered user.
        req.login(user, function(err) {
          if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
          return res.redirect('/');
        });
      }
    });
  });

  router.get('/signin', function (req, res) {
    res.render('pages/signin', { user: req.accessToken ? req.user : null });
  });

  router.get('/signout', function(req, res, next) {
    req.logout();
    res.redirect('/');
  });

  router.get('/verified', function(req, res) {
    res.render('pages/verified');
  });

  router.get('/request-password-reset', function(req, res, next) {
    res.render('pages/request-password-reset', {});
  });

  router.post('/request-password-reset', function(req, res, next) {
    User.resetPassword({
      email: req.body.email
    }, function(err) {
      if (err) return res.status(401).send(err);

      res.render('pages/response', {
        title: 'Password reset requested',
        content: 'Check your email for further instructions',
        redirectTo: '/',
        redirectToLinkText: 'Log in'
      });
    });
  });

  router.get('/reset-password', function(req, res, next) {
    res.render('pages/password-reset', {
      accessToken: req.accessToken.id
    });
  });

  router.post('/reset-password', function(req, res, next) {
    if (!req.accessToken) return res.sendStatus(401);

    //verify passwords match
    if (!req.body.password ||
        !req.body.confirmation ||
        req.body.password !== req.body.confirmation) {
      return res.sendStatus(400, new Error('Passwords do not match'));
    }

    User.findById(req.accessToken.userId, function(err, user) {
      if (err) return res.sendStatus(404);
      user.updateAttribute('password', req.body.password, function(err, user) {
      if (err) return res.sendStatus(404);
        res.render('pages/response', {
          title: 'Password reset success',
          content: 'Your password has been reset successfully',
          redirectTo: '/',
          redirectToLinkText: 'Log in'
        });
      });
    });
  });

  function checkResObject(req, res, next) {
    console.log('CHECK_REQ_OBJECT')
    console.log('USER', req.user)
    console.log('TOKEN', req.accessToken)
    next()
  }

  server.use(router);
};
