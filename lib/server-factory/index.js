var http = require('http')
var https = require('https')
var fs = require('fs')

module.exports = serverFactory

function serverFactory (app, options) {
  var secure = options.protocol === 'https'
  var servers = []

  servers.push(create(app, options))

  if (secure && options.https.redirect === 'normal') {
    servers.push(createSecure(app, options))
  }

  servers.forEach(function (server) {
    // Decorate `server` object with a `listen` handler
    server.listen = function (cb) {
      server.server.listen(server.port, cb)
    }
  })

  return servers
}

function create (app, options) {
  return {
    port: options.port,
    server: http.createServer(app)
  }
}

function createSecure (app, options) {
  var privateKey = fs.readFileSync(options.https.serverKey, 'utf-8')
  var certificate = fs.readFileSync(options.https.serverCert, 'utf-8')

  return {
    port: options.https.port,
    server: https.createServer({
      key: privateKey,
      cert: certificate
    }, app)
  }
}
