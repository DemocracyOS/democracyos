var adminRoutes = require('lib/admin/boot/routes')
var siteRoutes = require('lib/site/boot/routes')

module.exports = function (multiForum) {
  adminRoutes(multiForum)
  siteRoutes(multiForum)
}
