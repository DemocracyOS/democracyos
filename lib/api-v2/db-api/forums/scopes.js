const expose = require('lib/utils').expose
const userScopes = require('../users/scopes')

exports.ordinary = {}

exports.ordinary.keys = {
  expose: [
    'name',
    'title',
    'owner.fullName',
    'summary'
  ],

  select: [
    'name',
    'title',
    'owner', // owner id
    'summary'
  ]
}

exports.ordinary.populate = {
  path: 'owner',
  select: userScopes.ordinary.select
}

exports.ordinary.select = exports.ordinary.keys.expose.concat(
  exports.ordinary.keys.select
).join(' ')

exports.ordinary.expose = (function () {
  const exposeFields = expose(exports.ordinary.keys.expose)

  return function exposeForum (forum) {
    return exposeFields(forum.toJSON())
  }
})()