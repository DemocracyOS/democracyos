const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  BAD_REQUEST
} = require('http-status')

class APIError extends Error {
  constructor (
    message,
    {
      status = INTERNAL_SERVER_ERROR,
      translationKey = null
    },
    metadata = {}
  ) {
    super(message)

    Error.captureStackTrace(this, this.constructor)

    this.status = status
    this.translationKey = translationKey
    this.metadata = metadata
  }
}

const ErrNotFound = new APIError('not found', {
  translationKey: 'NOT_FOUND',
  status: NOT_FOUND
})

const ErrMissingParam = (field) =>  new APIError('Missing required paramether', {
  translationKey: 'MISSING_PARAM',
  status: BAD_REQUEST
}, {
  field: field
})

const ErrParamTooLong = (field) => new APIError('Paramether is too long', {
  translationKey: 'PARAM_LENGTH',
  status: BAD_REQUEST
}, {
  field: field
})

module.exports = {
  APIError,
  ErrNotFound,
  ErrMissingParam,
  ErrParamTooLong
}
