require('lib/models')()
const ObjectID = require('mongodb').ObjectID
const Topic = require('lib/models').Topic
const Vote = require('lib/models').Vote
const dbReady = require('lib/models').ready
const calcResult = require('lib/api-v2/db-api/topics/utils').calcResult

const mapPromises = (fn) => (array) => Promise.all(array.map(fn))

exports.up = function up (done) {
  dbReady()
    .then(() => Topic.collection.find({}).toArray())
    .then(mapPromises(function (topic) {
      if (!topic.action || !Object.keys(topic.action).includes('box')) return Promise.resolve(0)
      const newVotes = topic.action.box.map((vote) => {
        const newVote = new Vote({ author: vote.author, value: vote.value, topic: topic._id })
        return newVote.save().then(() => Promise.resolve(1)).catch((err) => {
          if (err.code === 11000) return Promise.resolve(0)
          return Promise.reject(err)
        })
      })
      return Promise.all(newVotes).then((results) => {
        return calcResult(topic)
          .then((results) => {
            const closed = topic.closingAt && topic.closingAt.getTime() < Date.now()
            const action = {
              count: closed ? topic.action.count : results.count,
              results: closed ? topic.action.results : results.results,
              method: topic.action.method
            }
            return Topic.collection.findOneAndUpdate({ _id: topic._id }, { $set: { 'action': action } })
          })
      })
    }))
    .then(function (results) {
      const total = results.filter((v) => !!v).length
      console.log(`decouple topics votes from ${total} topics succeded.`)
      done()
    })
    .catch(function (err) {
      console.log('decouple topics votes failed at ', err)
      done(err)
    })
}

exports.down = function down (done) {
  dbReady()
    .then(() => Topic.collection.find({}).toArray())
    .then(mapPromises(function (topic) {
      return Vote.find({ topic: topic._id })
        .then((votes) => votes.map((v) => ({ value: v.value, author: v.author, createdAt: v.createdAt })))
        .then((box) => calcResult(topic).then((results) => [results, box]))
        .then(([results, box]) => ({
          _id: new ObjectID(),
          count: results.count,
          results: results.results,
          method: topic.action.method,
          box: box
        }))
        .then((action) => Topic.collection.findOneAndUpdate({ _id: topic._id }, { $set: { 'action': action } }))
    }))
    .then(function (results) {
      const total = results.filter((v) => !!v).length
      console.log(`decouple topics votes from ${total} topics succeded.`)
      done()
    })
    .catch(function (err) {
      console.log('decouple topics votes failed at ', err)
      done(err)
    })
}
