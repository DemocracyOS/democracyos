const urlBuilder = require('lib/url-builder')

module.exports = function settingsRoutes (multiForum) {
  urlBuilder.register('forums.new', '/forums/new')
  urlBuilder.register('settings', '/admin')
  urlBuilder.register('settings.wild', '/admin/*')
  urlBuilder.register('settings.section', '/admin/:section')
}
