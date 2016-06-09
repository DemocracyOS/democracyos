import domify from 'domify'
import merge from 'merge'
import user from '../user/user.js'
import t from 't-component'
import tagImages from '../tags/images.js'
import config from '../config/config'

/**
 * Render default modules
 */

export default function render (template, options) {
  var defaults = {
    user: user,
    t: t,
    tagImages: tagImages,
    config: config
  }

  return template(merge(defaults, options))
}

export function dom (template, options) {
  return domify(render(template, options))
}

/**
 * Alias dom method so it doesnt conflicts with 'component-dom' module.
 */

export { dom as domRender }
