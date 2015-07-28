//define plugin
exports.register = function(server, options, next){
  // define routes
  server.route([
      // receiving a post request
      {
        method: 'POST', 
        path: '/users',
        handler: function(request, reply){
          var db = request.server.plugins['hapi-mongodb'].db
            ;
          var user = request.payload.user;
          // user = {
          //  name: ...
          //  email: ...
          // }
          db.collection('users').insert(user, function(err,writeResult){
                reply(writeResult);
          })
        }
      }
    ]);

  next(); // after this plugin, load the next plugin
};

// defining the description of plugin
exports.register.attributes = {
  name: 'users-routes',
  version: '0.0.1'
};