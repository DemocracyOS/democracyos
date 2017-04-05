const expose = require('lib/utils').expose
const userScopes = require('../users/scopes')

exports.ordinary = {}

exports.ordinary.keys = {
  expose: [
    'name',
    'title',
    'owner',
    'summary'
  ],

  select: [
    'deletedAt',
    'visibility'
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
  const exposeFn = expose(exports.ordinary.keys.expose)

  function exposeFields (forum) {
    const json = exposeFn(forum.toJSON())

    json.owner = userScopes.ordinary.expose(json.owner)

    return json
  }

  return function exposeForum (forum) {
    return exposeFields(forum)
  }
})()
