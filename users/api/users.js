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
      const results = await User.list({ filter: req.query.filter, limit: req.query.limit, page: req.query.page, ids: req.query.ids })
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
    console.log(req)
    try {
      const user = await User.get({ id: req.params.id })
      res.status(OK).json(user)
    } catch (err) {
      next(err)
    }
  })
  .put(async (req, res, next) => {
    try {
      const updatedUser = await User.update({ id: req.params.id, user: req.body })
      res.status(OK).json(updatedUser)
    } catch (err) {
      next(err)
    }
  })
  .delete(async (req, res, next) => {
    try {
      await User.remove(req.params.id)
      res.status(OK).json({ id: req.params.id })
    } catch (err) {
      next(err)
    }
  })

module.exports = router
