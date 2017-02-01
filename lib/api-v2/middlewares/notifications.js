const notifier = require('lib/notifications').notifier
const User = require('lib/db-api').user
const urlBuilder = require('lib/url-builder')
var log = require('debug')('democracyos:notifications-v2')

exports.commentReply = function commentReply (req, res, next) {
  next()
  User.get(req.comment.author.id, function(err, commentAuthor) {
    if(err) return log(err)

    const r = {
      id: req.reply.id,
      author: { id: req.user.id },
      text: req.reply.text
    }

    const c = {
      id: req.comment.id,
      author: { id: commentAuthor }
    }

    const topicUrl = urlBuilder.for('site.topic', {forum: req.forum.name, id: req.topic.id})

    notifier.notify('comment-reply')
      .to(commentAuthor.email)
      .withData({ reply: r, comment: c, url: topicUrl })
      .send(function (err, data) {
        if (err) {
          return log('Error: comment vote notification fail')
        }
        log('Comment vote notification delivered')
      })
  })
}
