/**
 * Extends module's paths with
 * process' mainModule's paths.
 *
 * @param {Object} m module to extend
 * @api public
 */

module.exports = function(m) {
  process.mainModule.paths.forEach(function(p) {
    if (~m.paths.indexOf(p)) return;
    m.paths.push(p);
  });
}