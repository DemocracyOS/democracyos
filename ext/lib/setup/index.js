const topicApi = require('lib/api/topic')
const userApi = require('lib/db-api/user')

const topicExtraFields = [
  'extra',
  'extra.numero',
  'extra.distrito',
  'extra.area',
  'extra.description',
  'extra.monto'
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
