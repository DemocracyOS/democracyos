const moduleAlias = require('module-alias')

moduleAlias.addAlias('lib/site/boot', __filename)

module.exports = function site (req, res, next) {
  next()
}
