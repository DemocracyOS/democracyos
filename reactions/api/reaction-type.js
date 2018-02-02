const express = require('express')
const {
  OK,
  CREATED,
  NO_CONTENT,
  INTERNAL_SERVER_ERROR
} = require('http-status')
const { log } = require('../../main/logger')
const ReactionType = require('../db-api/reaction-type')

const router = express.Router()

router.route('/')
  .post(async (req, res, next) => {
    try {
      await ReactionType.create(req.body)
      res.status(CREATED).end()
    } catch (err) {
      log.error(err)
      res.status(INTERNAL_SERVER_ERROR).json({ error: 'error' })
    }
  })
  .get(async (req, res, next) => {
    try {
      let results = []
      if (req.query.name) {
        results = await ReactionType.listByName({ name: req.query.name, limit: req.query.limit, page: req.query.page })
      } else {
        results = await ReactionType.list({ limit: req.query.limit, page: req.query.page })
      }

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
      const user = await ReactionType.get(req.params.id)
      res.status(OK).json(user)
    } catch (err) {
      log.error(err)
      res.status(INTERNAL_SERVER_ERROR).json({ error: 'error' })
    }
  })
  .put(async (req, res, next) => {
    try {
      await ReactionType.update({ id: req.params.id, reactionType: req.body })
      res.status(NO_CONTENT).end()
    } catch (err) {
      log.error(err)
      res.status(INTERNAL_SERVER_ERROR).json({ error: 'error' })
    }
  })
  .delete(async (req, res, next) => {
    try {
      await ReactionType.remove(req.params.id)
      res.status(NO_CONTENT).end()
    } catch (err) {
      log.error(err)
      res.status(INTERNAL_SERVER_ERROR).json({ error: 'error' })
    }
  })

module.exports = router
