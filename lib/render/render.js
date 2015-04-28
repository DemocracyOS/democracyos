import domify from 'domify';
import merge from 'merge';
import citizen from '../citizen/citizen.js';
import translation from 't-component';
import tagImages from '../tag-images/index.js';

/**
 * Render default modules
 */

export default render;
export var dom = dom;

function render(template, options) {
  var defaults = {
    citizen: citizen,
    t: translation,
    tagImages: tagImages,
    config: config
  };

  return template(merge(defaults, options));
}

function dom(template, options) {
  return domify(render(template, options));
}
