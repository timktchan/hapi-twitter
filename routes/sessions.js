var Bcrypt = require ('bcrypt');
var Auth = require ('./auth'); // var Author = {};
// Auth.authenticated();

exports.register = function(server, options, next){
  
  server.route([
    {
      method:'POST',
      path: '/sessions',
      handler: function(request,reply){
        var db = request.server.plugins['hapi-mongodb'].db;
        
        var user = request.payload.user;

        db.collection('users').findOne({username: user.username}, function(err, userMongo) {
            if (err) {return reply("Internal MongoDB error", err);}
            // 1.stop if user doesnt exists
            if (userMongo === null) {
              return reply ({userExisted: false});
            }
            // 2.check password
            // Bcrypt.compare("")
            Bcrypt.compare(user.password,userMongo.password,function(err, same){
              if (!same) {
                return reply ({authorized: false});
              }
              
              var randomKeyGenerator = function() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
              };
              // create new session in the sessions collection
              var session = {
                user_id: userMongo._id,
                session_id: randomKeyGenerator()
              };
              db.collection('sessions').insert(session, function(err, writeResult){
                  if (err) {return reply("Internal MongoDB error", err);}
                  // 4. set the same session_id in client's cookie
                  request.session.set('hapi_twitter_session',session);
                  reply({authorized: true});
              });
            });
        });
      }
    },
    {
      // defining a route to check if the user is authenticated / logged
      method:'GET',
      path:'/authenticated',
      handler: function(request,reply){
        // usually we write all loigcs here
        // but in this case we will write it somewhere, so other files or other routes can also use this method
        var callback = function(result){
          reply(result);
        };
        Auth.authenticated(request,callback);
      }
    },
  ]);
  next();
};

exports.register.attributes = {
  name: 'sessions-route',
  version: '0.0.1',
}