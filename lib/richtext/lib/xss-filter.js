var xss = require('xss')
var deepMixIn = require('mout/object/deepMixIn')
var videoUrlInspector = require('democracyos-video-url-inspector')
var config = require('lib/config')

module.exports = function xssFilter (opts) {
  var defaults = {
    fontFace: false,
    fontSize: true,
    fontWidth: true,
    image: true,
    video: true,
    link: true,
    bullet: true,
    list: true
  }

  var options = deepMixIn(defaults, opts)

  var empty = []
  var whiteList = {
    div: [ 'style', 'class' ],
    span: [ 'style' ],
    br: empty,
    b: empty,
    i: empty,
    u: empty,
    ul: empty,
    ol: empty,
    li: empty
  }

  if (options.image) whiteList.img = [ 'src' ]
  if (options.video) whiteList.iframe = [ 'src' ]
  if (options.link) whiteList.a = [ 'href' ]

  var filter = new xss.FilterXSS({
    whiteList: whiteList,

    css: {
      whiteList: {
        color: true,
        'text-align': true,
        'background-color': true,
        'font-size': true
      }
    },

    safeAttrValue: function (tag, name, value, cssFilter) {
      value = xss.safeAttrValue(tag, name, value, cssFilter)

      // Remove protocol from srcs, to force https when needed
      if (config.forceSafeImageURLs &&
        name === 'src' &&
        typeof value === 'string') {
        value = value.replace(/^https?:\/\//, '//')
      }

      // Parse iframe's to only allow video embeds
      if (tag === 'iframe' && name === 'src') {
        var video = videoUrlInspector(value)
        value = video ? video.embedUrl : ''
      }

      return value
    }
  })

  return filter.process.bind(filter)
}
