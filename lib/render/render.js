import domify from 'domify';
import merge from 'merge';
import citizen from '../citizen/citizen.js';
import t from 't';
import tagImages from '../tags/images.js';

/**
 * Render default modules
 */

export default function render(template, options) {
  var defaults = {
    citizen: citizen,
    t: t,
    tagImages: tagImages,
    config: config
  };

  return template(merge(defaults, options));
}

export function dom(template, options) {
  return domify(render(template, options));
}
