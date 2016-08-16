var expose = require('lib/utils').expose
var userFields = require('../users/fields')

var fields = module.exports = {}

fields.ordinary = {}

fields.ordinary.keys = [
  'id',
  'text',
  'createdAt',
  'editedAt',
  'reference',
  'flags',
  'score',
  'repliesCount'
]

fields.ordinary.selectKeys = [
  'replies',
  'author'
]

fields.ordinary.select = fields.ordinary.keys.concat(
  fields.ordinary.selectKeys
).join(' ')

fields.ordinary.expose = expose(fields.ordinary.keys.concat(
  userFields.ordinary.keys.map((v) => `author.${v}`)
))
