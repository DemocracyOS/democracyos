const express = require('express')
const {
  OK,
  CREATED,
  FORBIDDEN,
  NO_CONTENT
} = require('http-status')
const ReactionInstance = require('../db-api/reaction-instance')
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
      // try {
      //   const newReactionInstance = await ReactionInstance.create(req.body)
      //   res.status(CREATED).json({
      //     data: newReactionInstance
      //   })
      // } catch (err) {
      //   next(err)
      // }
      res.status(FORBIDDEN).end()
    })
  // GET reaction-instances
  .get(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
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
  .get(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        // const user = await ReactionInstance.get(req.params.id)
        // res.status(OK).json(user)
        res.status(FORBIDDEN).end()
      } catch (err) {
        next(err)
      }
    })
  .put(
    isLoggedIn,
    isAdmin,
    async (req, res, next) => {
      try {
        // const updatedReactionInstance = await ReactionInstance.update({ id: req.params.id, reactionInstance: req.body })
        // res.status(OK).json(updatedReactionInstance)
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
        // await ReactionInstance.remove(req.params.id)
        // res.status(OK).json({ id: req.params.id })
        res.status(FORBIDDEN).end()
      } catch (err) {
        next(err)
      }
    })

module.exports = router
