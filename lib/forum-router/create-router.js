var prefix = '/:forum'

function createRouter (config) {
  var multiForum = config.multiForum
  return function forumRouter (route) {
    if (!multiForum) return route
    return prefix + (route === '/' ? '' : route)
  }
}

module.exports = createRouter
