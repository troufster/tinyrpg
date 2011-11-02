var server = require('./lib/server');
var app = require('./client/app');

if (!module.parent) {
  app.listen(3300);
  console.log("Express server listening on port %d", app.address().port);
}