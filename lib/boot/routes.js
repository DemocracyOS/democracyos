var config = require('lib/config')

require('lib/ext/routes')
require('lib/admin/boot/routes')(config.multiForum)
require('lib/site/boot/routes')(config.multiForum)
