import config from '../config/config'
import reservedNames from '../models/forum/reserved-names'

export default function checkReservedNames (ctx, next) {
  if (!config.multiForum) return next()
  if (!~reservedNames.indexOf(ctx.params.forum)) return next()
  window.location.reload(false)
}
