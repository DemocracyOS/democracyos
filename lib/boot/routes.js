
var multiForum = require(typeof window !== 'undefined' ? 'lib/config' : 'lib/config/config')
require('lib/admin/boot/routes')(multiForum)
require('lib/site/boot/routes')(multiForum)
