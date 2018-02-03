const express = require('express')
const {
  OK,
  CREATED,
  NO_CONTENT
} = require('http-status')
const User = require('../db-api/user')

const router = express.Router()

router.route('/')
  .post(async (req, res, next) => {
    try {
      await User.create(req.body)
      res.status(CREATED).end()
    } catch (err) {
      next(err)
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
      next(err)
    }
  })

router.route('/:id')
  .get(async (req, res, next) => {
    try {
      const user = await User.get({ id: req.params.id })
      res.status(OK).json(user)
    } catch (err) {
      next(err)
    }
  })
  .put(async (req, res, next) => {
    try {
      await User.update({ id: req.params.id, user: req.body })
      res.status(NO_CONTENT).end()
    } catch (err) {
      next(err)
    }
  })
  .delete(async (req, res, next) => {
    try {
      await User.remove(req.params.id)
      res.status(NO_CONTENT).end()
    } catch (err) {
      next(err)
    }
  })

module.exports = router
