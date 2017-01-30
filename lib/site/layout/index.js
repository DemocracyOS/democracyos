var path = require('path')
var layout = require('lib/layout')

var middleware = layout(path.resolve(__dirname, 'index.jade'))

module.exports = function renderLayout (req, res, next) {
  return middleware(req, res, next)
}

module.exports.setTemplate = function setTemplate (newTemplate) {
  middleware = layout(newTemplate)
}
