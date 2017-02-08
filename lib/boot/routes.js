var config = require('lib/config')

require('lib/admin/boot/routes')(config.multiForum)
require('lib/site/boot/routes')(config.multiForum)
