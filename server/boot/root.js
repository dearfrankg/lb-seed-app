'use strict';

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', spit, server.loopback.status());
  server.use(router);

  function spit(req, res, next) {
    console.log('TOKEN', req.accessToken)
    console.log('USER', req.user)
    next()
  }

};
