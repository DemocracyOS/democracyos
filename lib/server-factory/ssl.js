var enforce = require('express-sslify');
var log = require('debug')('democracyos:server-factory:ssl');

/**
 * Ensure SSL redirection if necessary
 */

module.exports = function ssl(redirect) {
  switch (redirect) {
    case 'normal':
      return enforce.HTTPS();
      log('SSL is enabled with HTTP -> HTTPS automatic redirection');
      break;
    case 'reverse-proxy':
      return enforce.HTTPS(true);
      log('Using redirection to HTTPS compatible with reverse-proxies (e.g.: Heroku/Nodejitsu/nginx)');
      log('**WARNING** Do NOT use if not behind a reverse proxy; this can be easily spoofed in a direct client/server connection!');
      break;
    case 'azure':
      return enforce.HTTPS(false, true);
      log('Using redirection to HTTPS compatible with Windows Azure');
      log('**WARNING** Do NOT use outside Windows Azure; this can be easily spoofed outside their environment!');
      break;
    case 'no-redirect':
      log('SSL is enabled with NO HTTP -> HTTPS redirection');
      log('**WARNING** This is not recommended for production environments unless you have other means of redirection.');
      log('It\'s ok if you are in a development environment');
      break;
    default:
      log('**WARNING**SSL is enabled but no valid redirection strategy was configured');
      log('Defaulting to no-redirect strategy. This is NOT recommended for production enviroments!');
      log('It\'s ok if you are in a development environment');
      break;
  }
}
