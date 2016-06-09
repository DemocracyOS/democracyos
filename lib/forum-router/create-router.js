var prefix = '/:forum'

function createRouter (config) {
  var multiForum = config.multiForum
  return function forumRouter (route) {
    if (!multiForum) return route
    if (!route) return prefix
    if (route[0] !== '/') route = '/' + route
    return prefix + route
  }
}

module.exports = createRouter
