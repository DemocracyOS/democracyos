require('lib/models')()

const Topic = require('lib/models').Topic
const dbReady = require('lib/models').ready

const mapPromises = (fn) => (array) => Promise.all(array.map(fn))

exports.up = function up (done) {
  dbReady()
    .then(() => Topic.collection.find({}).toArray())
    .then(mapPromises(function (topic) {
      const count = (topic.participants && topic.participants.length > 0) ? topic.participants.length : 0

      return Topic.collection.findOneAndUpdate({ _id: topic._id }, {
        $set: {
          participantsCount: count
        }
      })
    }))
    .then(function (results) {
      const total = results.filter((v) => !!v).length
      console.log(`update topics participants count from ${total} topics succeded.`)
      done()
    })
    .catch(function (err) {
      console.log('update topics participants count failed at ', err)
      done(err)
    })
}

exports.down = function down (done) {
  dbReady()
    .then(function () {
      return Topic.collection
        .find({})
        .toArray()
    })
    .then(mapPromises(function (topic) {
      return Topic.collection.findOneAndUpdate({ _id: topic._id }, {
        $unset: { participantsCount: '' }
      })
    }))
    .then(function (results) {
      const total = results.filter((v) => !!v).length
      console.log(`update topics participants count from ${total} topics succeded.`)
      done()
    })
    .catch(function (err) {
      console.log('update topics participants count failed at', err)
      done(err)
    })
}
