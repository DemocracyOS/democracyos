var supported = ['ca', 'de', 'en', 'es', 'fr', 'fi', 'gl', 'it', 'nl', 'pt', 'ru', 'sv','uk'];
var locale = require('locale')(supported);

module.exports.supported = supported;

module.exports.middleware = function (req, res, next) {
  /* req -> user-agent, cookie -> jwt */
  req.locale = 'gl';
  next();
};
