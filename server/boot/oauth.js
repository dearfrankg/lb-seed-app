var PassportConfigurator =
  require('loopback-component-passport').PassportConfigurator;
var flash = require('express-flash');
var loopback = require('loopback');

module.exports = function(app) {
  var passportConfigurator = new PassportConfigurator(app);

  passportConfigurator.init();
  app.use(flash());
  passportConfigurator.setupModels({
    userModel: app.models.user,
    userIdentityModel: app.models.userIdentity,
    userCredentialModel: app.models.userCredential
  });
  var config = require('../../providers.json');
  for (var s in config) {
    var c = config[s];
    c.session = c.session !== false;
    passportConfigurator.configureProvider(s, c);
  }
};
