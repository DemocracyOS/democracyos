const urlBuilder = require('lib/url-builder')

module.exports = function settingsRoutes (multiForum) {
  urlBuilder.register('forums.new', '/forums/new')
  urlBuilder.register('settings', '/settings')
  urlBuilder.register('settings.profile', '/settings/profile')
  urlBuilder.register('settings.password', '/settings/password')
  urlBuilder.register('settings.notifications', '/settings/notifications')
  urlBuilder.register('settings.forums', '/settings/forums')
  urlBuilder.register('settings.user-badges', '/settings/user-badges')
}
