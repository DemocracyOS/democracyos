var xss = require('xss');
var videoUrlInspector = require('video-url-inspector');

module.exports = function xssFilter (opts) {
  var defaults = {
    fontFace: false,
    fontSize: false,
    fontWidth: true,
    image: true,
    video: true,
    link: true,
    bullet: true,
    list: true
  };

  var empty = [];
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
  };

  if (opts.image) whiteList.img = [ 'src' ];
  if (opts.video) whiteList.iframe = [ 'src' ];
  if (opts.link) whiteList.a = [ 'href' ];

  var filter = new xss.FilterXSS({
    whiteList: whiteList,

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

  return filter.process.bind(filter);
};
