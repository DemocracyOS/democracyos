const topicApi = require('lib/api/topic')
const userApi = require('lib/db-api/user')
require('./users-scopes')

const topicExtraFields = [
  'extra',
  'extra.votes'
]

topicApi.topicListKeys.push.apply(topicApi.topicListKeys, topicExtraFields)
topicApi.topicKeys.push.apply(topicApi.topicKeys, topicExtraFields)

userApi.expose.confidential.keys.push(
  'extra',
  'extra.cod_doc',
  'extra.nro_doc',
  'extra.sexo'
)

module.exports = function setup (app) {
  // dont setup nothing on app for now
}
