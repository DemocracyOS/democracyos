require('lib/models')()

const Topic = require('lib/models').Topic
const Forum = require('lib/models').Forum
const User = require('lib/models').User
const modelsReady = require('lib/models').ready
const mapPromises = (fn) => (array) => Promise.all(array.map(fn))
const config = require('lib/config')

exports.up = function up (done) {
  modelsReady()
    .then(() => Topic.collection.find({}).toArray())
    .then(mapPromises(function (topic) {
      if (topic.owner) return Promise.resolve(0)
      const updateOwner = (owner) => Topic.collection.findOneAndUpdate({ _id: topic._id }, {
        $set: {
          owner: owner
        }
      })

      return Forum.collection.findOne({ _id: topic.forum }).then((forum) => {
        if (forum && forum.owner) {
          return updateOwner(forum.owner)
        } else {
          return User.findOne({ email: config.staff[0] })
            .then((staff) => {
              if (!staff) throw new Error('Cant assign owner')
              return updateOwner(staff)
            })
        }
      })
    }))
    .then(function (results) {
      const total = results.filter((v) => !!v).length
      console.log(`add topics owner from ${total} topics succeded.`)
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
