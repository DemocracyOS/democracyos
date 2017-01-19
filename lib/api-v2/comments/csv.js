const express = require('express')
const config = require('lib/config')
const middlewares = require('../middlewares')
const api = require('../db-api')

const app = module.exports = express()

app.get('/comments.csv',
middlewares.users.restrict,
middlewares.forums.findByForumId,
middlewares.topics.findAllFromForum,
middlewares.forums.privileges.canChangeTopics,
function getCsv (req, res, next) {
  return api.comments.populateTopics(req.topics)
    .then((topicsComments) => {
      var titles = [
        'Topic ID',
        'Topic Title',
        'Topic URL',
        'Comment ID',
        'Comment Text',
        'Comment Author Fullname',
        'Reply Text',
        'Reply Author Fullname'
      ].join(',') + '\r'

      const commentCsv = titles +
        topicsComments.map((topic) => {
          return topic.comments.map((comment) => {
            return comment.replies.map((reply) => {
              return [

                topic.id,
                topic.mediaTitle,
                `${config.protocol}://${config.host}/consulta/${topic.id}`,
                '"' + comment.id + '"',
                '"' + escapeTxt(comment.text) + '"',
                '"' + comment.author.fullName + '"',
                '"' + escapeTxt(reply.text) + '"',
                '"' + reply.author.fullName + '"'

              ]
            }).join(',')
          }).join('\n')
        }).join('\n')

      res.status(200)
      res.set({
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename=' + req.forum.name.replace(/\s/g, '-') + '.csv'
      })
      res.write(commentCsv)
      res.end()
    }).catch(next)
})

function escapeTxt (text) {
  if (!text) return ''
  return text.replace(/"/g, "'").replace(/\r/g, '').replace(/\n/g, '')
}
