const express = require('express')
const {
  OK,
  CREATED,
  NO_CONTENT,
  INTERNAL_SERVER_ERROR
} = require('http-status')
const { log } = require('../../main/logger')
const ReactionRule = require('../db-api/reaction-rule')

const router = express.Router()

router.route('/')
  .post(async (req, res, next) => {
    try {
      await ReactionRule.create(req.body)
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
        results = await ReactionRule.listByName({ name: req.query.name, limit: req.query.limit, page: req.query.page })
      } else {
        results = await ReactionRule.list({ limit: req.query.limit, page: req.query.page })
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
      const user = await ReactionRule.get(req.params.id)
      res.status(OK).json(user)
    } catch (err) {
      log.error(err)
      res.status(INTERNAL_SERVER_ERROR).json({ error: 'error' })
    }
  })
  .put(async (req, res, next) => {
    try {
      await ReactionRule.update({ id: req.params.id, reactionRule: req.body })
      res.status(NO_CONTENT).end()
    } catch (err) {
      log.error(err)
      res.status(INTERNAL_SERVER_ERROR).json({ error: 'error' })
    }
  })
  .delete(async (req, res, next) => {
    try {
      await ReactionRule.remove(req.params.id)
      res.status(NO_CONTENT).end()
    } catch (err) {
      log.error(err)
      res.status(INTERNAL_SERVER_ERROR).json({ error: 'error' })
    }
  })

module.exports = router
