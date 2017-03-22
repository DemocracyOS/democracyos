const debug = require('debug')
const config = require('lib/config')
const server = require('lib/server')

const log = debug('democracyos:root')

// Basic server configuration
const opts = {
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
