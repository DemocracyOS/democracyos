var bus = require('bus');
var config = require('config');
var page = require('page');

page('/logout', function(ctx, next) {
  bus.emit('logout', redirect);
});

function redirect () {
  if (config.signinUrl) return window.location = config.signinUrl;
  page('/');
}
