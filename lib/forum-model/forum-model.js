var Forums = require('./model.js');

module.exports = new Forums({
  url: '/api/forum/mine'
}).fetch();