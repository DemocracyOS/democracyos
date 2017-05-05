module.exports = function removeRoute (app, path) {
  app._router.stack = app._router.stack.filter((layer) => {
    return !layer.match(path)
  })
}
