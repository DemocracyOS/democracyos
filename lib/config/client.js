var config = require('lib/config');
var client = {};

config.client.forEach(function(key){
  if (!config.hasOwnProperty(key)) {
    throw new Error('Config key "' + key + '" non existent.');
  }

  client[key] = config[key];
});

module.exports = client;