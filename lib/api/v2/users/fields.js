var expose = require('lib/utils').expose

var fields = module.exports = {}

fields.ordinary = {}

fields.ordinary.keys = [
  'id',
  'firstName',
  'lastName',
  'fullName',
  'displayName',
  'avatar'
]

fields.ordinary.selectKeys = [
  'email',
  'profilePictureUrl'
]

fields.ordinary.select = fields.ordinary.keys.concat(
  fields.ordinary.selectKeys
).join(' ')

fields.ordinary.expose = expose(fields.ordinary.keys)
