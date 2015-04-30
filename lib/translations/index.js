var fs = require('fs');
var path = require('path');

var locales = fs.readdirSync(path.resolve(__dirname, '/lib')).map(function(v){
  return v.replace('.json', '');
});

locales.forEach(function(locale){
  module.exports[locale] = require('./lib/'+locale);
});

module.exports.help = function(t) {
  locales.forEach(function(locale){
    t[locale] = module.exports[locale];
  });
}
