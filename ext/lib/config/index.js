const path = require('path')
const democracyosConfig = require('democracyos-config')
const config = require('lib/config')
const clientConfig = require('lib/config/client')

const extConfig = module.exports = democracyosConfig({
  path: path.join(__dirname, '..', '..', 'config')
})

config.ext = extConfig.ext

clientConfig.ext = clientConfig.ext || {}

extConfig.ext.client.forEach((k) => {
  clientConfig.ext[k] = extConfig.ext[k]
})

// Expose FB client ID
clientConfig.ext.facebookClientID = config.auth.facebook.clientID
