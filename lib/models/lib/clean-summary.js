var xss = require('xss');
var videoUrlInspector = require('video-url-inspector');

var empty = [];

var filter = new xss.FilterXSS({
  whiteList: {
    div: [ 'style', 'class' ],
    span: [ 'style' ],
    iframe: [ 'src' ],
    img: [ 'src' ],
    a: [ 'href' ],
    br: empty,
    b: empty,
    i: empty,
    u: empty,
    ul: empty,
    ol: empty,
    li: empty
  },

  css: {
    whiteList: {
      color: true,
      'text-align': true,
      'background-color': true,
    }
  },

  safeAttrValue: function(tag, name, value, cssFilter) {
    value = xss.safeAttrValue(tag, name, value, cssFilter);

    // Remove protocol from images, to force https when needed
    if ('img' === tag && 'src' === name) {
      if ('string' !== typeof value) return;
      return value.replace(/^https?:\/\//, '//');
    }

    // Parse iframe's to only allow video embeds
    if ('iframe' === tag && 'src' === name) {
      var video = videoUrlInspector(value);
      return video ? video.embedUrl : '';
    }

    return value;
  }
});

module.exports = filter.process.bind(filter);