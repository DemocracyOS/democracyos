/**
 * Module dependencies.
 */

var config = require('lib/config');
var hidden = config('visibility') == 'hidden';

// app.all('/api/*', function isPrivate(req, res, next) {
//   if (!config('private app')) return next();
//   if (req.user) return next();

//   res.status(403).send();
// });


module.exports = function middleware(req, res, next) {
  console.log('vis');
  if (req.user) return next();
  if (!hidden) return next();

  console.log('redirecting');
  res.redirect('/signin');
};
