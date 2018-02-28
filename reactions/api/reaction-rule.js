const express = require('express')
const {
  OK,
  CREATED,
  NO_CONTENT
} = require('http-status')
const ReactionRule = require('../db-api/reaction-rule')
// Requires winston lib for log
const { log } = require('../../main/logger')
// Requires CRUD apis
const router = express.Router()

router.route('/')
  // POST route
  .post(async (req, res, next) => {
    try {
      const newReactionRule = await ReactionRule.create(req.body)
      res.status(CREATED).json({
        data: newReactionRule
      })
    } catch (err) {
      next(err)
    }
  })
  // GET reaction-rules
  .get(async (req, res, next) => {
    try {
      let results = []
      results = await ReactionRule.list({ filter: req.query.filter, limit: req.query.limit, page: req.query.page })
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
      const user = await ReactionRule.get(req.params.id)
      res.status(OK).json(user)
    } catch (err) {
      next(err)
    }
  })
  .put(async (req, res, next) => {
    try {
      const updatedReactionRule = await ReactionRule.update({ id: req.params.id, reactionRule: req.body })
      res.status(OK).json(updatedReactionRule)
    } catch (err) {
      next(err)
    }
  })
  .delete(async (req, res, next) => {
    try {
      await ReactionRule.remove(req.params.id)
      res.status(OK).json({ id: req.params.id })
    } catch (err) {
      next(err)
    }
  })

module.exports = router
