const topicApi = require('lib/api/topic')
const userApi = require('lib/db-api/user')

topicApi.topicListKeys.push(
  'extra',
  'extra.numero',
  'extra.distrito',
  'extra.area',
  'extra.resumen',
  'extra.monto'
)

userApi.expose.confidential.keys.push(
  'extra',
  'extra.cod_doc',
  'extra.nro_doc',
  'extra.sexo'
)

module.exports = function setup (app) {
  // dont setup nothing on app for now
}
