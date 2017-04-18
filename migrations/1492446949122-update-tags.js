require('lib/models')()

const Topic = require('lib/models').Topic
const Tag = require('lib/models').Tag
const modelsReady = require('lib/models').ready
const mapPromises = (fn) => (array) => Promise.all(array.map(fn))

function setTag (topic) {
  return Tag.find({ _id: topic.tag })
    .then((tag) => {
      return new Promise((resolve, reject) => {
        Topic.collection
          .findOneAndUpdate({ _id: topic._id }, {
            $set: { tags: [tag[0].name] },
            $unset: { tag: tag[0]._id }
          },
          function (err, r) {
            if (err) return reject(err)
            resolve(1)
          })
      })
    })
}

exports.up = function up (done) {
  modelsReady()
    .then(() => Topic.collection.find({ tags: { $exists: false } }).toArray())
    .then(mapPromises(setTag))
    .then(function (results) {
      console.log(`update topics tags from ${results.length} topics succeded.`)
      done()
    })
    .catch(function (err) {
      console.error('update topics tags failed at ', err)
      throw new Error('update topics tags failed')
    })
}

exports.down = function down (done) {
  console.log('update topics tags has no down migration')
  done()
}
