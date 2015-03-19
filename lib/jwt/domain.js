var cookie = require('cookie');
var host = location.host;
var parts = host.split('.');
var key = 'foo-' + Date.now();
var ip = require('regexps').ip;

var hostname = location.hostname;
var domain = null;
var set = false;

for (var i = parts.length; i > 0; i--) {
  domain = '.' + parts.slice(i-1).join('.');
  if ('localhost' == hostname || ip.test(hostname)) {
    domain = null;
    break;
  }
  cookie(key, null, { domain: domain });
  cookie(key, 'bar', { domain: domain });
  if (cookie(key) == 'bar') {
    cookie(key, null, { domain: domain });
    set = true;
    break;
  }
}

cookie(key, null, { domain: domain });

domain = set ? domain : null;

module.exports = { domain: domain };
