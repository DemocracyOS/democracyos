/**
 * Map array of objects by `property`
 *
 * @param {Array} source array of objects to map
 * @param {String} property to map from objects
 * @return {Array} array of listed properties
 * @api private
 */

export default function pluck(source, property = 'id') {
  return source.map(function(item) { return item[property] })
}
