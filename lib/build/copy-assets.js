var fs = require('fs')
var through = require('through2-concurrent')
var mkdirp = require('mkdirp')
var log = require('./log')('copy')

module.exports = function (dir, opts) {
  opts = opts || {}

  function destination (sourcePath, base) {
    var fullPath = sourcePath
    var relativePath = fullPath.replace(base, '')
    var relativeDest = relativePath.replace(/\/assets/, '')
    return dir + relativeDest
  }

  function directory (path) {
    return path.substring(0, path.lastIndexOf('/'))
  }

  return through.obj(function (file, enc, cb) {
    var path = destination(file.history[0], file.base)
    mkdirp(directory(path), function () {
      log.debug(path)
      fs.writeFile(path, file.contents, cb)
    })
  })
}
