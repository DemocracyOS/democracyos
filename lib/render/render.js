import domify from 'domify'
import merge from 'merge'
import t from 't-component'
import user from '../user/user'
import config from '../config/config'
import tagImages from '../tags/images'

/**
 * Render default modules
 */

export default function render (template, options = {}) {
  const opts = merge({
    t: t,
    user: user,
    config: config,
    tagImages: tagImages
  }, opts)

  return template(opts)
}

export function dom (template, options) {
  const html = render(template, options)
  return domify(html)
}

export { dom as domRender }
/**
 * Alias dom method so it doesnt conflicts with 'component-dom' module.
 */
