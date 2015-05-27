var xss = require('xss');
var videoUrlInspector = require('democracyos-video-url-inspector');

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

      // Remove protocol from srcs, to force https when needed
      if ('src' === name && 'string' === typeof value) {
        value = value.replace(/^https?:\/\//, '//');
      }

      // Parse iframe's to only allow video embeds
      if ('iframe' === tag && 'src' === name) {
        var video = videoUrlInspector(value);
        value = video ? video.embedUrl : '';
      }

      return value;
    }
  });

  return filter.process.bind(filter);
};
