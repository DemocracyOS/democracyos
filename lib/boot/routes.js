
var multiForum = require(typeof window !== 'undefined' ? 'lib/config/config' : 'lib/config')
require('lib/admin/boot/routes')(multiForum)
require('lib/site/boot/routes')(multiForum)
