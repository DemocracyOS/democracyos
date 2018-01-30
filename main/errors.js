const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND
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

module.exports = {
  APIError,
  ErrNotFound
}
