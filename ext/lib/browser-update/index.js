const moduleAlias = require('module-alias')

moduleAlias.addAlias('lib/browser-update', __filename)

module.exports = function site (req, res, next) {
  next()
}
