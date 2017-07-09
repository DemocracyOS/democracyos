const debug = require('debug')
const notifier = require('democracyos-notifier')
const User = require('lib/db-api').user
const urlBuilder = require('lib/url-builder')
const config = require('lib/config')
const userScopes = require('../db-api/users/scopes')

const log = debug('democracyos:api:middlewares:notifications')

exports.commentReply = function commentReply (req, res, next) {
  next()

  User.get(req.comment.author.id, function (err, commentAuthor) {
    if (err) return log(err)

    const forum = {
      id: req.forum._id.toString()
    }

    const topic = {
      id: req.topic._id.toString(),
      mediaTitle: req.topic.mediaTitle
    }

    const reply = {
      id: req.reply.id,
      author: userScopes.ordinary.expose(req.user),
      text: req.reply.text
    }

    const comment = {
      id: req.comment.id,
      author: userScopes.ordinary.expose(commentAuthor),
      text: req.comment.text
    }

    const domain = `${config.protocol}://${config.host}`
    const topicUrl = domain + urlBuilder.for('site.topic', {
      forum: req.forum.name,
      id: req.topic.id
    })

    notifier.now('comment-reply', {
      forum,
      topic,
      reply,
      comment,
      url: topicUrl
    }).then(() => {
      log('Comment reply notification delivered')
    })
    .catch((err) => {
      log('Error: comment vote notification fail')
    })
  })
}
