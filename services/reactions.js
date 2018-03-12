const express = require('express')
const {
  OK,
  CREATED,
  NO_CONTENT
} = require('http-status')
const ReactionInstance = require('../reactions/db-api/reaction-instance')
// Requires winston lib for log
const { log } = require('../main/logger')
// Requires CRUD apis
const router = express.Router()

router.route('/posts/:id/graphs')
  // GET reaction-instances
  .get(async (req, res, next) => {
    try {
      const results = await ReactionInstance.listByPost({ id: req.params.id, limit: req.query.limit, page: req.query.page })
      let dataSet = []
      results.docs.forEach((instance) => {
        let options = new Set()
        let frequency = []
        let instanceResults = []
        instance.results.forEach((vote) => {
          options.add(vote.value)
          frequency[vote.value] = (frequency[vote.value] ? frequency[vote.value] : 0) + 1
        })
        options.forEach((option) => {
          instanceResults.push({
            value: option,
            count: frequency[option]
          })
        })
        dataSet.push({
          id: instance._id,
          data: instanceResults
        })
      })

      res.status(OK).json(dataSet)
      // res.status(OK).json({
      //   results: results.docs,
      //   pagination: {
      //     count: results.total,
      //     page: results.page,
      //     limit: results.limit
      //   }
      // })
    } catch (err) {
      next(err)
    }
  })

router.route('/:id/graphs')
  // GET reaction-instances
  .get(async (req, res, next) => {
    try {
      const results = await ReactionInstance.listByPost({ id: req.params.id, limit: req.query.limit, page: req.query.page })
      let values = new Set()
      let dataSet = []
      results.forEach((element) => {
        values.add(element.value)
      })
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

module.exports = router
