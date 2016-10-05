var path = require('path');
var config = require('../config.json');

module.exports = function(app) {

  var User = app.models.user;

  // handle verify email
  User.observe('after save', function (context, next) {
      if (context.isNewInstance) {
        context.isNewInstance = false;
        var curUser = context.instance;
        var options = {
          type: 'email',
          to: curUser.email,
          from: 'noreply@loopback.com',
          subject: 'Thanks for registering.',
          template: path.resolve(__dirname, '../views/emails/verify.ejs'),
          redirect: '/verified',
          user: curUser
        };

        curUser.verify(options, function (err, response) {
          if (err) return next(err);
          return next()
        });
      } else {
        return next()
      }
  });

  // handle request-password-reset email
  User.on('resetPasswordRequest', function(info) {
    var url = 'http://' + config.host + ':' + config.port + '/reset-password';
    var html = 'Click <a href="' + url + '?access_token=' +
        info.accessToken.id + '">here</a> to reset your password';

    User.app.models.Email.send({
      to: info.email,
      from: info.email,
      subject: 'Password reset',
      html: html
    }, function(err) {
      if (err) return console.log('> error sending password reset email');
      // console.log('> sending password reset email to:', info.email);
    });
  });

};
