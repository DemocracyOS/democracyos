const express = require('express')
const {
  OK,
  CREATED,
  NO_CONTENT
} = require('http-status')
const ReactionInstance = require('../reactions/db-api/reaction-instance')
const ReactionVote = require('../reactions/db-api/reaction-vote')
// Requires winston lib for log
const { log } = require('../main/logger')
// Requires CRUD apis
const router = express.Router()

const dataForLike = function (instance) {
  let data = null
  let userParticipants = instance.results
  // let userParticipants = instance.results.map((x) => x.userId)
  data = {
    id: instance._id,
    title: instance.title,
    instruction: instance.instruction,
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
  // let userParticipants = instance.results.map((x) => x.userId)
  let userParticipants = instance.results
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
    title: instance.title,
    instruction: instance.instruction,
    reactionRule: instance.reactionId,
    data: instanceResults,
    participants: userParticipants
  }
  return data
}

const createLikeVote = function (data) {
  return {
    userId: data.userId,
    meta: {
      timesVoted: 1,
      deleted: false
    }
  }
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

router.route('/:idInstance/vote')
  // GET reaction-instances
  .post(async (req, res, next) => {
    try {
      console.log(req.body)
      // Check if the user has voted before
      console.log(req.body.reactionVoteId)
      if (req.body.reactionVoteId != null) {
        // Get the Reaction
        let reactionVote = await ReactionVote.get(req.body.reactionVoteId)
        console.log(reactionVote)
        if (reactionVote.meta.deleted) {
          reactionVote.meta.deleted = !reactionVote.meta.deleted
          reactionVote.meta.timesVoted += 1
        } else {
          reactionVote.meta.deleted = !reactionVote.meta.deleted
        }
        await ReactionVote.update({ id: req.body.reactionVoteId, reactionVote: reactionVote })
        console.log(reactionVote)        
        res.status(OK).json({
          data: reactionVote
        })
      } else {
        let voteData = null
        switch (req.body.reactionRule.method) {
          case 'LIKE':
            voteData = createLikeVote(req.body)
            break
          default:
            throw Exception('Reaction Methods not found')
        }
        console.log(req.params.idInstance)
        let reactionInstance = await ReactionInstance.get(req.params.idInstance)
        let reactionVote = await ReactionVote.create(voteData)
        reactionInstance.results.push(reactionVote._id)
        await ReactionInstance.update({ id: req.params.idInstance, reactionInstance: reactionInstance })

        res.status(CREATED).json({
          data: reactionVote
        })
      }
      // res.status(OK).json(data)
    } catch (err) {
      next(err)
    }
  })
module.exports = router
