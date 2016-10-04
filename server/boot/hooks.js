var path = require('path');

module.exports = function(app) {

  var User = app.models.user;

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

};
