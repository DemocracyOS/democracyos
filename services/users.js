const express = require('express')
const {
  OK
} = require('http-status')
// Requires winston lib for log
const { log } = require('../main/logger')
const User = require('../users/db-api/user')
// Requires CRUD apis
const router = express.Router()

router.route('/admins')
// GET an array of admin users
  .get(async (req, res, next) => {
    log.debug('GET admin service')
    try {
      const admins = await User.get({ 'role': 'admin' })
      res.status(OK).json(admins)
    } catch (err) {
      next(err)
    }
  })

module.exports = router
