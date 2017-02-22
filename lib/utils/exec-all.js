module.exports = function execAll (obj, ctx) {
  const keys = Object.keys(obj)

  return function execAllOfObject () {
    const result = {}

    keys.forEach((k) => {
      if (typeof obj[k] === 'function') {
        result[k] = obj[k].apply(ctx || this, arguments)
      } else {
        result[k] = obj[k]
      }
    })

    return result
  }
}
