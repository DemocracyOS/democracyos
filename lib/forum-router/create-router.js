var prefix = '/:forum';

function createRouter(config) {
  var singleForum = config.singleForum;
  return function forumRouter(route) {
    if (singleForum) return route;
    return prefix + ('/' === route ? '' : route);
  };
}

module.exports = createRouter;
