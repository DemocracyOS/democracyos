import page from 'page'
import user from '../user/user.js'
import config from '../config/config.js'

let hidden = config.visibility === 'hidden'

export default function (ctx, next) {
  if (!hidden) return next()
  if (user.logged()) return next()

  page('/signin')
}
