exports.register = function (server, options, next){
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: function(request, reply){
        reply.view('index'); // look for templates/index.html
      }
    },
    {
      method: 'GET',
      path: '/public/{path*}', // there may be other files, e.g. css in public directory
      handler: {
        directory: {
          path: 'public'
        }
      }
    }
  ]);
  next();
};

exports.register.attributes = {
  name: 'static-pages-route',
  version: '0.0.1'
};