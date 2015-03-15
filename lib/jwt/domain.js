var host = location.host;
var domain;

if (host.split('.').length == 1)
{
   // no "." in a domain - it's localhost or something similar
   domain = null;
}
else
{
   // Remember the cookie on all subdomains.
   //
   // Start with trying to set cookie to the top domain.
   // (example: if user is on foo.com, try to set
   //  cookie to domain ".com")
   //
   // If the cookie will not be set, it means ".com"
   // is a top level domain and we need to
   // set the cookie to ".foo.com"
   domainParts = host.split('.');
   domainParts.shift();
   domain = '.'+domainParts.join('.');
}

module.exports = { domain: domain };
