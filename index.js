var config = require('lib/config')
var server = require('lib/server')
var log = require('debug')('democracyos:root')

// Basic server configuration
var opts = {
  port: process.env.PORT || config.publicPort,
  protocol: config.protocol,
  https: config.https
}

if (module === require.main) {
  server(opts, function (err) {
    if (err) {
      log(err)
      process.exit(1)
      return
    }

    log('DemocracyOS server running...')
  })
}
