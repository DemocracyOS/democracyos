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

const ErrNotFound = (message) => new APIError(message, {
  translationKey: 'NOT_FOUND',
  status: NOT_FOUND
})

const ErrMissingParam = (field) => new APIError('Missing required paramether', {
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

const ErrSettingsNotInit = new APIError('Settings have not been initialized', {
  translationKey: 'SETTINGS_NOT_INIT',
  status: INTERNAL_SERVER_ERROR
})

const ErrSettingsInit = new APIError('Settings is already initialized', {
  translationKey: 'SETTINGS_INIT',
  status: BAD_REQUEST
})

module.exports = {
  APIError,
  ErrNotFound,
  ErrMissingParam,
  ErrParamTooLong,
  ErrSettingsNotInit,
  ErrSettingsInit
}
