
function Router(config) {
  return function router(route) {
    return (config.singleDemocracy ? '' : '/:democracyName') + route;
  }
}

module.exports = Router;
