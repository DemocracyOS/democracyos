var Forums = require('./model.js');

module.exports = new Forums({
  url: '/forums/mine'
}).fetch();
