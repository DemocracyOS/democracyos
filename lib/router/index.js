
function Router(config) {
  return function router(route) {
    return (config.singleDemocracy ? '' : '/:forum') + route;
  }
}

module.exports = Router;
