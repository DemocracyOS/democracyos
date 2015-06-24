var prefix = '/:forum';

function createRouter(config) {
  var singleForum = config.singleForum;
  return function forumRouter(route) {
    return (singleForum ? '' : prefix) + route;
  };
}

module.exports = createRouter;
