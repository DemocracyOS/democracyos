
function Router(config) {
  return function router(route) {
    return (config.singleForum ? '' : '/:forum') + route;
  }
}

module.exports = Router;
