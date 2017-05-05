const expose = require('lib/utils').expose
const usersScopes = require('lib/api-v2/db-api/users/scopes')

usersScopes.ordinary.keys.expose.push(
  'extra.validated',
  'extra.label'
)

usersScopes.ordinary.select = usersScopes.ordinary.keys.expose.concat(
  usersScopes.ordinary.keys.select
).join(' ')

usersScopes.ordinary.expose = expose(usersScopes.ordinary.keys.expose)
