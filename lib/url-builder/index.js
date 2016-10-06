var urls = {}

module.exports.register = function (label, path) { urls[label] = path }

module.exports.for = function (label, params) {
  var url = urls[label]
  if (!url) throw new Error('Unknown label for urlBuilder', label)
  Object.keys(params).forEach(function (param) {
    var pExp = new RegExp(':' + param, 'g')
    url.replace(pExp, url)
  })
  return url
}
