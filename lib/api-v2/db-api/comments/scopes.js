var expose = require('lib/utils').expose
var userScopes = require('../users/scopes')

var scopes = module.exports = {}

scopes.ordinary = {}

scopes.ordinary.keys = {
  expose: [
    'id',
    'text',
    'createdAt',
    'editedAt',
    'reference',
    'flags',
    'score',
    'repliesCount'
  ],

  select: [
    'replies',
    'author'
  ]
}

scopes.ordinary.select = scopes.ordinary.keys.expose.concat(
  scopes.ordinary.keys.select
).join(' ')

scopes.ordinary.expose = expose([].concat(
  scopes.ordinary.keys.expose,
  userScopes.ordinary.keys.expose.map((v) => `author.${v}`)
))
