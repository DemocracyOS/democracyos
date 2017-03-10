require('lib/models')()

const Topic = require('lib/models').Topic
const dbReady = require('lib/models').ready

const mapPromises = (fn) => (array) => Promise.all(array.map(fn))

exports.up = function up (done) {
  // mediaTitle 225
  // author 100
  // authorUrl 250
  // source 250
  // coverUrl 250
  // links[n].url 250

  dbReady()
    .then(() => Topic.collection
      .find({})
      .toArray()
      .then(mapPromises(function (topic) {
        let mediaTitleInvalid = topic.mediaTitle && topic.mediaTitle.length > 255
        let authorInvalid = topic.author && topic.author.length > 100
        let authorUrlInvalid = topic.authorUrl && topic.authorUrl.length > 250
        let sourceInvalid = topic.source && topic.source.length > 250
        let coverUrlInvalid = topic.coverUrl && topic.coverUrl.length > 250
        let linksInvalid = topic.links && topic.links.map((link) => link.url && link.url.length > 250).filter((urlInvalid) => urlInvalid).length > 0

        if (
          !mediaTitleInvalid &&
          !authorInvalid &&
          !authorUrlInvalid &&
          !sourceInvalid &&
          !coverUrlInvalid &&
          !linksInvalid
        ) {
          return Promise.resolve()
        }

        let mediaTitle = mediaTitleInvalid ? topic.mediaTitle.slice(0, 255) : topic.mediaTitle
        let author = authorInvalid ? topic.author.slice(0, 100) : topic.author
        let authorUrl = authorUrlInvalid ? topic.authorUrl.slice(0, 250) : topic.authorUrl
        let source = sourceInvalid ? topic.source.slice(0, 250) : topic.source
        let coverUrl = coverUrlInvalid ? topic.coverUrl.slice(0, 250) : topic.coverUrl
        let links = linksInvalid ? topic.links.map((link) => {
          if (!link.url) return link
          link.url = link.url.slice(0, 250)
          return link
        }) : topic.links

        return Topic.collection.findOneAndUpdate({ _id: topic._id }, {
          $set: {
            mediaTitle: mediaTitle,
            author: author,
            authorUrl: authorUrl,
            source: source,
            coverUrl: coverUrl,
            links: links
          }
        })
      }))
    )
    .then(function (results) {
      const total = results.filter((v) => !!v).length
      console.log(`update topics maxlength from ${total} topics succeded.`)
      done()
    })
    .catch(function (err) {
      console.log('update topics maxlength failed at ', err)
      done(err)
    })
}

exports.down = function down (done) {
  console.log('update topics maxlength has no down migration')
  done()
}
