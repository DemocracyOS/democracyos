var fs = require('fs');
var path = require('path');

module.exports = fs.readdirSync(path.resolve(__dirname, 'lib')).map(function(v){
  return v.replace('.json', '');
});
