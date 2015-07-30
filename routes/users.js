var Bcrypt = require('bcrypt');
var Joi = require('joi');
var Auth = require ('./auth');
//define plugin
exports.register = function(server, options, next){
  // define routes
  server.route([
      // receiving a post request
      {
        method: 'POST', 
        path: '/users',

        config: {
          handler: function(request, reply){
            var db = request.server.plugins['hapi-mongodb'].db
              ;
            var user = request.payload.user;
            // user = {
            //  name: ...
            //  email: ...
            // }
            var uniqUserQuery = {
              $or: [
                {username:user.username}, // from payload
                {email: user.email}
              ]
            };

            db.collection('users').count(uniqUserQuery, function(err,userExist){
                if (userExist) {
                  return reply ('Error:usename exists',err); // if return, things following doesnt run
                } 
                //encrypt my password
                Bcrypt.genSalt(10,function(err, salt){
                  Bcrypt.hash(user.password,salt,function(err,encrypted){
                    user.password = encrypted;
                    // insert a user document into database
                    db.collection('users').insert(user, function(err,writeResult){
                      if (err) {return reply("Internal MongoDB error", err)}
                      reply(writeResult);
                    });
                  });
                });
              });
          },
          validate: {
            payload: {
              user: {
                email: Joi.string().email().max(50).required(),
                password: Joi.string().min(5).max(20).required(),
                username: Joi.string().min(3).max(20).required(),
                name: Joi.string().min(3).max(20)
                // validate at backend > someone may use our api, always put logic in backend
              }
            }
          }
        }
      },
      {
        method: 'GET', 
        path: '/users',
        handler: function(request, reply){
          Auth.authenticated(request,function(session){
            if (!session.authenticated) {
              return reply (session);
            }
            var db = request.server.plugins['hapi-mongodb'].db
              ;
            db.collection('users').find().toArray(function(err,users){
                if (err) {return reply("Internal MongoDB error", err)}
                reply(users);
                
              });
          });

        }             
      }
    ]);

//

  next(); // after this plugin, load the next plugin
};

// defining the description of plugin
exports.register.attributes = {
  name: 'users-routes',
  version: '0.0.1'
};