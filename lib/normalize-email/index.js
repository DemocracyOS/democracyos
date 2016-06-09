var config = require('lib/config')
var normalizeEmail = require('./normalize-email')

module.exports = function (email) {
  return normalizeEmail(email, { allowEmailAliases: config.allowEmailAliases })
}
