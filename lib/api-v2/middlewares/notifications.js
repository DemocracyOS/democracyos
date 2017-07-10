const notifier = require('democracyos-notifier')
const urlBuilder = require('lib/url-builder')
const config = require('lib/config')
const utils = require('lib/utils')
const api = require('lib/db-api')
const userScopes = require('../db-api/users/scopes')

exports.comment = function comment (req, res, next) {
  const topic = {
    id: req.topic._id.toString(),
    mediaTitle: req.topic.mediaTitle,
    forum: req.topic.forum
  }

  const comment = {
    id: req.comment.id,
    author: userScopes.ordinary.expose(req.user),
    text: req.comment.text
  }

  const topicUrl = utils.buildUrl(config, {
    pathname: urlBuilder.for('site.topic', {
      forum: req.forum.name,
      id: req.topic.id
    })
  })

  notifier.now('new-comment', {
    topic,
    comment,
    url: topicUrl
  }).then(() => {
    next()
  }).catch(next)
}

exports.commentReply = function commentReply (req, res, next) {
  api.user.get(req.comment.author.id, function (err, commentAuthor) {
    if (err) return next(err)

    const topic = {
      id: req.topic._id.toString(),
      mediaTitle: req.topic.mediaTitle,
      forum: req.topic.forum
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

    const topicUrl = utils.buildUrl(config, {
      pathname: urlBuilder.for('site.topic', {
        forum: req.forum.name,
        id: req.topic.id
      })
    })

    notifier.now('comment-reply', {
      topic,
      reply,
      comment,
      url: topicUrl
    }).then(() => {
      next()
    }).catch(next)
  })
}
