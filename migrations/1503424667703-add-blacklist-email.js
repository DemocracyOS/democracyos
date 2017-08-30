'use strict'
const Topic = require('lib/models').Topic
const User = require('lib/models').User
const Vote = require('lib/models').Vote
const dbReady = require('lib/models').ready
const config = require('lib/config')
const calcResult = require('lib/api-v2/db-api/topics/utils').calcResult

const mapPromises = (fn) => (array) => Promise.all(array.map(fn))

/**
 * Make any changes you need to make to the database here
 */

exports.up = function up (done) {
  dbReady()
    .then(() => config.blackListEmails ? Promise.resolve() : Promise.reject())
    .then(() => User.collection.find({ email: { $in: config.blackListEmails.map((d) => new RegExp(`@${d}*$`)) } }).toArray())
    .then((users) => User.collection.deleteMany({ email: { $in: config.blackListEmails.map((d) => new RegExp(`@${d}*$`)) } })
      .then(() => Vote.collection.deleteMany({ author: { $in: users.map((u) => u._id) } })))
    .then(() => Topic.collection.find({}).toArray())
    .then(mapPromises((topic) => {
      return calcResult(topic)
      .then(({ count, results }) => {
        const closed = topic.closingAt && topic.closingAt.getTime() < Date.now()
        const action = {
          count: closed ? topic.action.count : count,
          results: closed ? topic.action.results : results,
          method: topic.action.method
        }
        return Topic.collection.findOneAndUpdate({ _id: topic._id }, { $set: { 'action': action } })
      })
    }))
    .then(function () {
      console.log(`Remove black listed emails.`)
      done()
    })
    .catch(function (err) {
      console.log('Remove black listed emails failed at ', err)
      done(err)
    })
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
exports.down = function down (done) {
  done()
}
