const express = require('express')
const paginate = require('express-paginate')
const errors = require('../main/errors')
const { log } = require('../main/logger')
const router = express.Router()

// Apply paginate middleware to API routes
router.use(
  function (req, res, next) {
    // set default or minimum is 10
    if (req.query.limit <= 10) req.query.limit = 10
    next()
  },
  paginate.middleware(10, 50)
)

// API routes
router.use('/users', require('../users/api/users'))

// Catch 404 and forward to error handler.
router.use((req, res, next) => {
  next(errors.ErrNotFound)
})

// General api error handler. Respond with the message and error if we have it
// while returning a status code that makes sense.
router.use((err, req, res, next) => {
  if (err !== errors.ErrNotFound) {
    log.error(err)
  }

  if (err instanceof errors.APIError) {
    res.status(err.status).json({
      // message: res.locals.t(`error.${err.translation_key}`),
      error: err
    })
  } else {
    res.status(500).json({})
  }
})

module.exports = router
