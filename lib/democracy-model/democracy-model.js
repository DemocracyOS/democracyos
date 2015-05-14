var Democracies = require('./model.js');

module.exports = new Democracies({
  url: '/democracies/mine'
}).fetch();
