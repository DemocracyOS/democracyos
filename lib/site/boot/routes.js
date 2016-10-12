var urlBuilder = require('lib/url-builder')

module.exports = function (multiForum) {
  var forum = multiForum ? '/:forum/' : '/'
  urlBuilder.register('forum', forum)
  urlBuilder.register('topic', forum + 'topic/:id')
}
