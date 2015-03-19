/**
 * Module dependencies.
 */

var config = require('lib/config');
var path = require('path');
var resolve = path.resolve;
var html = resolve(__dirname, 'index.jade');

module.exports = function (req, res) {
  var client = {};

  config.client.forEach(function(k) {
    client[k] = config[k];
  });

  res.render(html, { config: config, client: client });
};
