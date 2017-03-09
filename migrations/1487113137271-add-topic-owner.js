require('lib/models')()

const Topic = require('lib/models').Topic
const modelsReady = require('lib/models').ready

function mapPromises (fn) {
  return (array) => Promise.all(array.map(fn))
}

exports.up = function up (done) {
  modelsReady()
    .then(function () {
      return Topic
        .find({})
        .populate('forum')
        .exec()
    })
    .then(mapPromises(function (topic) {
      if (topic.owner) return false
      topic.owner = topic.forum.owner
      return topic.save()
    }))
    .then(function (results) {
      const total = results.filter((v) => !!v).length
      console.log(`add topics owner from ${total} topics succeded.`)
      done()
    })
    .catch(function (err) {
      console.error('add topics owner failed at ', err)
      done(err)
    })
}

exports.down = function down (done) {
  modelsReady()
    .then(function () {
      return Topic
        .find({})
        .populate('forum')
        .exec()
    })
    .then(mapPromises(function (topic) {
      if (!topic.owner) return false

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
