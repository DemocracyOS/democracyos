var cookie = require('cookie');
var host = location.host;
var parts = host.split('.');

var domain = null;

for (var i = parts.length; i > 0; i--) {
  domain = '.' + parts.slice(i-1).join('.');
  if ('localhost' == location.hostname) {
    domain = null;
    break;
  }
  cookie('foo', null, { domain: domain });
  cookie('foo', 'bar', { domain: domain });
  if (cookie('foo') == 'bar') {
    cookie('foo', null, { domain: domain });
    break;
  }
}

cookie('foo', null, { domain: domain });

module.exports = { domain: domain };
