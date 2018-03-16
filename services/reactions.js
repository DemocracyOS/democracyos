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

const dataForLike = function (instance) {
  let data = null
  let userParticipants = instance.results.map((x) => x.userId)
  data = {
    id: instance._id,
    reactionRule: instance.reactionId,
    participants: userParticipants,
    data: {
      name: 'LIKE',
      value: instance.results.length
    }
  }
  return data
}

const dataForChoose = function (instance) {
  let data = null
  let options = new Set()
  let frequency = []
  let instanceResults = []
  let userParticipants = instance.results.map((x) => x.userId)
  instance.results.forEach((vote) => {
    options.add(vote.value)
    frequency[vote.value] = (frequency[vote.value] ? frequency[vote.value] : 0) + 1
  })
  options.forEach((option) => {
    instanceResults.push({
      option: option,
      value: frequency[option]
    })
  })
  data = {
    id: instance._id,
    reactionRule: instance.reactionId,
    data: instanceResults,
    participants: userParticipants
  }
  return data
}

router.route('/posts/:id/results')
  // GET reaction-instances
  .get(async (req, res, next) => {
    try {
      const instances = await ReactionInstance.listResultsByPost({ id: req.params.id })
      let dataArray = []
      instances.forEach((instance) => {
        let dataInstance = {}

        switch (instance.reactionId.method) {
          case 'LIKE':
            dataInstance = dataForLike(instance)
            break
          // This is for future implementations..
          // Depending of the type of rule, it needs to process data in a different way
          case 'VOTE':
            dataInstance = dataForChoose(instance)
            break
          default:
            break
        }
        dataArray.push(dataInstance)
      })

      res.status(OK).json(dataArray)
    } catch (err) {
      next(err)
    }
  })

router.route('/:id/result')
  // GET reaction-instances
  .get(async (req, res, next) => {
    try {
      const instance = await ReactionInstance.getResult({ id: req.params.id })
      let data = {}
      switch (instance.reactionId.method) {
        case 'LIKE':
          data = dataForLike(instance)
          break
          // This is for future implementations..
          // Depending of the type of rule, it needs to process data in a different way
        case 'VOTE':
          data = dataForChoose(instance)
          break
        default:
          break
      }

      res.status(OK).json(data)
    } catch (err) {
      next(err)
    }
  })

module.exports = router
