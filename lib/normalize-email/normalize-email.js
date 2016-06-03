var verigy = require('verigy')

module.exports = function (email, options) {
  if (!email) return null
  if (typeof email !== 'string') return null

  options = options || {}

  if (!options.allowEmailAliases) email = verigy(email)
  return email.toLowerCase()
}
