const express = require('express')
const {
  OK,
  CREATED,
  NO_CONTENT
} = require('http-status')
const ReactionInstance = require('../db-api/reaction-instance')
// Requires winston lib for log
const { log } = require('../../main/logger')
// Requires CRUD apis
const router = express.Router()

router.route('/')
  // POST route
  .post(async (req, res, next) => {
    try {
      const newReactionInstance = await ReactionInstance.create(req.body)
      res.status(CREATED).json({
        data: newReactionInstance
      })
    } catch (err) {
      next(err)
    }
  })
  // GET reaction-instances
  .get(async (req, res, next) => {
    try {
      const results = await ReactionInstance.list({ limit: req.query.limit, page: req.query.page })

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
      const user = await ReactionInstance.get(req.params.id)
      res.status(OK).json(user)
    } catch (err) {
      next(err)
    }
  })
  .put(async (req, res, next) => {
    try {
      const updatedReactionInstance = await ReactionInstance.update({ id: req.params.id, reactionInstance: req.body })
      res.status(OK).json(updatedReactionInstance)
    } catch (err) {
      next(err)
    }
  })
  .delete(async (req, res, next) => {
    try {
      await ReactionInstance.remove(req.params.id)
      res.status(OK).json({ id: req.params.id })
    } catch (err) {
      next(err)
    }
  })

module.exports = router
