const express = require('express')
const {
  OK,
  CREATED,
  FORBIDDEN,
  NO_CONTENT
} = require('http-status')
const ReactionVote = require('../db-api/reaction-vote')
// Requires winston lib for log
const { log } = require('../../main/logger')
// Requires CRUD apis
const router = express.Router()
const { isLoggedIn, isAdmin } = require('../../services/users')

router.route('/')
  // POST route
  .post(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        // const newReactionVote = await ReactionVote.create(req.body)
        // res.status(CREATED).json({
        //   data: newReactionVote
        // })
        res.status(FORBIDDEN).end()
      } catch (err) {
        next(err)
      }
    })
  // GET reaction-vote
  .get(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        const results = await ReactionVote.list({ limit: req.query.limit, page: req.query.page, ids: req.query.ids })
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
  .get(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        const user = await ReactionVote.get(req.params.id)
        res.status(OK).json(user)
      } catch (err) {
        next(err)
      }
    })
  .put(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        // const updatedReactionVote = await ReactionVote.update({ id: req.params.id, reactionVote: req.body })
        // res.status(OK).json(updatedReactionVote)
        res.status(FORBIDDEN).end()
      } catch (err) {
        next(err)
      }
    })
  .delete(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        // await ReactionVote.remove(req.params.id)
        // res.status(OK).json({ id: req.params.id })
        res.status(FORBIDDEN).end()
      } catch (err) {
        next(err)
      }
    })

module.exports = router
