var adminRoutes = require('lib/admin/boot/routes')
var siteRoutes = require('lib/site/boot/routes')
try {
  var extRoutes = require('ext/boot/routes')
} catch (err) { /* no extension moving on */ }

module.exports = function (multiForum) {
  adminRoutes(multiForum)
  siteRoutes(multiForum)
  if (extRoutes) extRoutes(multiForum)
}
