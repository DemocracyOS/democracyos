require('lib/models')()

const Topic = require('lib/models').Topic
const Forum = require('lib/models').Forum
const User = require('lib/models').User
const modelsReady = require('lib/models').ready
const mapPromises = (fn) => (array) => Promise.all(array.map(fn))
const config = require('lib/config')

function staff (topic) {
  return User.findOne({ email: config.staff[0] })
    .then((staff) => ({ topic: topic._id, owner: staff._id }))
}

function forumById (topic) {
  return Forum.collection
    .findOne({ _id: topic.forum })
}

function findOwner (topic) {
  return (forum) => forum && forum.owner
    ? Promise.resolve({ topic: topic._id, owner: forum.owner })
    : staff(topic)
}

function setOwner (topic, owner) {
  return new Promise((resolve, reject) => {
    Topic.collection
      .findOneAndUpdate({ _id: topic }, { $set: { owner } }, function (err, r) {
        if (err) {
          return reject(err)
        }
        resolve(1)
      })
  })
}

exports.up = function up (done) {
  modelsReady()
    .then(() => Topic.collection.find({ owner: { $exists: false } }).toArray())
    .then(mapPromises(function (topic) {
      return forumById(topic)
        .then(findOwner(topic))
    }))
    .then(mapPromises(function (result) {
      return setOwner(result.topic, result.owner)
    }))
    .then(function (results) {
      console.log(`add topics owner from ${results.length} topics succeded.`)
      done()
    })
    .catch(function (err) {
      console.error('add topics owner failed at ', err)
      throw new Error('add topics owner failed')
    })
}

exports.down = function down (done) {
  modelsReady()
    .then(() => Topic.collection.find({}).toArray())
    .then(mapPromises(function (topic) {
      if (!topic.owner) return Promise.resolve(0)

      return Topic.collection.findOneAndUpdate({
        _id: topic._id
      }, {
        $unset: { owner: '' }
      })
    }))
    .then(function (results) {
      const total = results.filter((v) => !!v).length
      console.log(`remove topic owner from ${total} topics succeded.`)
      done()
    })
    .catch(function (err) {
      console.log('remove topic owner failed at', err)
      done(err)
    })
}
