var cookie = require('cookie');
var host = location.host;
var parts = host.split('.');
var key = 'foo-' + Date.now();

var domain = null;

for (var i = parts.length; i > 0; i--) {
  domain = '.' + parts.slice(i-1).join('.');
  if ('localhost' == location.hostname) {
    domain = null;
    break;
  }
  cookie(key, null, { domain: domain });
  cookie(key, 'bar', { domain: domain });
  if (cookie(key) == 'bar') {
    cookie(key, null, { domain: domain });
    break;
  }
}

cookie(key, null, { domain: domain });

module.exports = { domain: domain };
