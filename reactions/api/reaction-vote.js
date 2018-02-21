const express = require('express')
const {
  OK,
  CREATED,
  NO_CONTENT
} = require('http-status')
const ReactionVote = require('../db-api/reaction-vote')
// Requires winston lib for log
const { log } = require('../../main/logger')
// Requires CRUD apis
const router = express.Router()

router.route('/')
  // POST route
  .post(async (req, res, next) => {
    try {
      const newReactionVote = await ReactionVote.create(req.body)
      res.status(CREATED).json({
        data: newReactionVote
      })
    } catch (err) {
      next(err)
    }
  })
  // GET reaction-vote
  .get(async (req, res, next) => {
    try {
      const results = await ReactionVote.list({ limit: req.query.limit, page: req.query.page })

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
      const user = await ReactionVote.get(req.params.id)
      res.status(OK).json(user)
    } catch (err) {
      next(err)
    }
  })
  .put(async (req, res, next) => {
    try {
      const updatedReactionVote = await ReactionVote.update({ id: req.params.id, reactionRule: req.body })
      res.status(OK).json(updatedReactionVote)
    } catch (err) {
      next(err)
    }
  })
  .delete(async (req, res, next) => {
    try {
      await ReactionVote.remove(req.params.id)
      res.status(NO_CONTENT).json(req.params.id)
    } catch (err) {
      next(err)
    }
  })

module.exports = router