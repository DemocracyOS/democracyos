/**
 * ExtendableError provides a base Error class to source off of that does not
 * break the inheritence chain.
 */
class ExtendableError {
  constructor (message = null) {
    this.message = message
    this.stack = new Error(message).stack
  }
}

/**
 * APIError is the base error that all application issued errors originate, they
 * are composed of data used by the front end and backend to handle errors
 * consistently.
 */
class APIError extends ExtendableError {
  constructor (
    message,
    { status = 500, translation_key = null },
    metadata = {}
  ) {
    super(message)

    this.status = status
    this.translation_key = translation_key
    this.metadata = metadata
  }

  toJSON () {
    return {
      message: this.message,
      status: this.status,
      translation_key: this.translation_key,
      metadata: this.metadata
    }
  }
}

// ErrPasswordTooShort is returned when the password length is too short.
const ErrPasswordTooShort = new APIError(
  'password must be at least 8 characters',
  {
    status: 400,
    translation_key: 'PASSWORD_LENGTH'
  }
)

const ErrMissingEmail = new APIError('email is required', {
  translation_key: 'EMAIL_REQUIRED',
  status: 400
})

const ErrMissingPassword = new APIError('password is required', {
  translation_key: 'PASSWORD_REQUIRED',
  status: 400
})

const ErrEmailTaken = new APIError('Email address already in use', {
  translation_key: 'EMAIL_IN_USE',
  status: 400
})

const ErrUsernameTaken = new APIError('Username already in use', {
  translation_key: 'USERNAME_IN_USE',
  status: 400
})

const ErrSameUsernameProvided = new APIError(
  'Username provided for change is the same as current',
  {
    translation_key: 'SAME_USERNAME_PROVIDED',
    status: 400
  }
)

const ErrSpecialChars = new APIError(
  'No special characters are allowed in a username',
  {
    translation_key: 'NO_SPECIAL_CHARACTERS',
    status: 400
  }
)

const ErrMissingUsername = new APIError(
  'A username is required to create a user',
  {
    translation_key: 'USERNAME_REQUIRED',
    status: 400
  }
)

// ErrEmailVerificationToken is returned in the event that the password reset is requested
// without a token.
const ErrEmailVerificationToken = new APIError('token is required', {
  translation_key: 'EMAIL_VERIFICATION_TOKEN_INVALID',
  status: 400
})

// ErrPasswordResetToken is returned in the event that the password reset is requested
// without a token.
const ErrPasswordResetToken = new APIError('token is required', {
  translation_key: 'PASSWORD_RESET_TOKEN_INVALID',
  status: 400
})

/**
 * ErrAuthentication is returned when there is an error authenticating and the
 * message is provided.
 */
class ErrAuthentication extends APIError {
  constructor (message = null) {
    super(
      'authentication error occured',
      {
        status: 401,
        translation_key: 'AUTHENTICATION'
      },
      {
        message
      }
    )
  }
}

const ErrNotFound = new APIError('not found', {
  translation_key: 'NOT_FOUND',
  status: 404
})

// ErrNotAuthorized is an error that is returned in the event an operation is
// deemed not authorized.
const ErrNotAuthorized = new APIError('not authorized', {
  translation_key: 'NOT_AUTHORIZED',
  status: 401
})

// ErrSettingsNotInit is returned when the settings are required but not
// initialized.
const ErrSettingsNotInit = new Error(
  'Talk is currently not setup. Please proceed to our webinstaller at $ROOT_URL/admin/install or run ./bin/cli-setup. Visit https://coralproject.github.io/talk/ for more information on installation and configuration instructions'
)

// ErrSettingsInit is returned when the setup endpoint is hit and we are already
// initialized.
const ErrSettingsInit = new APIError('settings are already initialized', {
  status: 500
})

// ErrLoginAttemptMaximumExceeded is returned when the login maximum is exceeded.
const ErrLoginAttemptMaximumExceeded = new APIError(
  'You have made too many incorrect password attempts.',
  {
    translation_key: 'LOGIN_MAXIMUM_EXCEEDED',
    status: 429
  }
)

// ErrEditWindowHasEnded is returned when the edit window has expired.
const ErrEditWindowHasEnded = new APIError('Edit window is over', {
  translation_key: 'EDIT_WINDOW_ENDED',
  status: 403
})

// ErrNotVerified is returned when a user tries to login with valid credentials
// but their email address is not yet verified.
const ErrNotVerified = new APIError(
  'User does not have a verified email address',
  {
    translation_key: 'EMAIL_NOT_VERIFIED',
    status: 401
  }
)

const ErrMaxRateLimit = new APIError('Rate limit exeeded', {
  translation_key: 'RATE_LIMIT_EXCEEDED',
  status: 429
})

module.exports = {
  APIError,
  ErrAuthentication,
  ErrEditWindowHasEnded,
  ErrEmailTaken,
  ErrEmailVerificationToken,
  ErrLoginAttemptMaximumExceeded,
  ErrMaxRateLimit,
  ErrMissingEmail,
  ErrMissingPassword,
  ErrMissingUsername,
  ErrNotAuthorized,
  ErrNotFound,
  ErrNotVerified,
  ErrPasswordResetToken,
  ErrPasswordTooShort,
  ErrSameUsernameProvided,
  ErrSettingsInit,
  ErrSettingsNotInit,
  ErrSpecialChars,
  ErrUsernameTaken,
  ExtendableError
}
