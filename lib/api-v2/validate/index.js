var schemaValidate = require('is-express-schema-valid').default
var serial = require('lib/middlewares/utils').serial

var defaultSchemas = ['payload', 'query', 'params']

module.exports = validate

validate.schemas = {
  pagination: require('./schemas/pagination')
}

function validate (schemas, options) {
  var extensions = []

  options = options || {}

  if (typeof options.filter === 'undefined') options.filter = true

  Object.keys(schemas).filter((schemaName) => {
    return defaultSchemas.indexOf(schemaName) !== -1
  }).forEach((schemaName) => {
    var schema = schemas[schemaName]
    var target = schemaName === 'payload' ? 'body' : schemaName

    Object.keys(schema).forEach((key) => {
      /**
       * Allow to set a 'default' value on validation schemas
       */
      if (typeof schema[key].default !== 'undefined') {
        extensions.push(function setDefaultValue (req, res, next) {
          if (typeof req[target][key] === 'undefined') {
            req[target][key] = schema[key].default
          }
          next()
        })
      }

      /**
       * Coerce req.query value to Number when 'schema.type' is 'integer'
       */
      if (schema[key].type === 'integer') {
        extensions.push(function coerceToInteger (req, res, next) {
          if (typeof req[target][key] !== 'undefined') {
            req[target][key] = Number(req[target][key])
          }
          next()
        })
      }
    })
  })

  return serial(serial.apply(this, extensions), schemaValidate(schemas, options))
}

validate.SchemaValidationError = schemaValidate.SchemaValidationError
