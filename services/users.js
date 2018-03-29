const express = require('express')
const {
  OK
} = require('http-status')
// Requires winston lib for log
const { log } = require('../main/logger')
const { ErrNotFound } = require('../main/errors')
const User = require('../users/models/user')
// Requires CRUD apis
const router = express.Router()

router.route('/admins')
// GET an array of admin users
  .get(async (req, res, next) => {
    log.debug('GET admin service')
    try {
      const results = await User.find({ role: 'admin' })
      if (results.length >= 1) {
        res.status(OK).json({
          admins: results
        })
      } else {
        throw ErrNotFound('Not admin users found')
      }
    } catch (err) {
      next(err)
    }
  })

module.exports = router
