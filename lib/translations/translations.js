var available = require('./available');

available.forEach(function(locale){
  module.exports[locale] = require('./lib/' + locale);
});
