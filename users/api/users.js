const express = require('express')
const {
  OK,
  CREATED,
  NO_CONTENT,
  INTERNAL_SERVER_ERROR
} = require('http-status')
const { log } = require('../../main/logger')
const User = require('../db-api/user')

const router = express.Router()

router.route('/')
  .post(async (req, res, next) => {
    try {
      await User.create(req.body)
      res.status(CREATED).end()
    } catch (err) {
      log.error(err)
      res.status(INTERNAL_SERVER_ERROR).json({ error: 'error' })
    }
  })
  .get(async (req, res, next) => {
    try {
      const results = await User.list({ limit: req.query.limit, page: req.query.page })

      res.status(OK).json({
        results: results.docs,
        pagination: {
          count: results.total,
          page: results.page,
          limit: results.limit
        }
      })
    } catch (err) {
      log.error(err)
      res.status(INTERNAL_SERVER_ERROR).json({ error: 'error' })
    }
  })

router.route('/:id')
  .get(async (req, res, next) => {
    try {
      const user = await User.get(req.params.id)
      res.status(OK).json(user)
    } catch (err) {
      log.error(err)
      res.status(INTERNAL_SERVER_ERROR).json({ error: 'error' })
    }
  })
  .put(async (req, res, next) => {
    try {
      await User.update({ id: req.params.id, user: req.body })
      res.status(NO_CONTENT).end()
    } catch (err) {
      log.error(err)
      res.status(INTERNAL_SERVER_ERROR).json({ error: 'error' })
    }
  })
  .delete(async (req, res, next) => {
    try {
      await User.remove(req.params.id)
      res.status(NO_CONTENT).end()
    } catch (err) {
      log.error(err)
      res.status(INTERNAL_SERVER_ERROR).json({ error: 'error' })
    }
  })

module.exports = router
