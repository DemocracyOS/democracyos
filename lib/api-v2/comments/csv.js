const express = require('express')
const json2csv = require('json-2-csv').json2csv
const moment = require('moment')
const config = require('lib/config')
const urlBuilder = require('lib/url-builder')
const middlewares = require('../middlewares')
const api = require('../db-api')

const app = module.exports = express()

const titles = [
  'Topic ID',
  'Topic Title',
  'Topic URL',
  'Comment ID',
  'Comment Date',
  'Comment Time',
  'Comment Date-time',
  'Comment Text',
  'Comment Author Fullname',
  'Reply ID',
  'Reply Date',
  'Reply Time',
  'Reply Date-time',
  'Reply Text',
  'Reply Author Fullname'
]

const emptyReply = {
  createdAt: '',
  id: '',
  text: '',
  author: { fullName: '' }
}

function fullUrl (topicId, forumName) {
  return config.protocol + '://' + config.host + urlBuilder
    .for('site.topic', {
      id: topicId,
      forum: forumName
    })
}

function escapeTxt (text) {
  if (!text) return ''
  return text.replace(/"/g, '\'').replace(/\r/g, '').replace(/\n/g, '')
}

app.get('/comments.csv',
middlewares.users.restrict,
middlewares.forums.findByName,
middlewares.topics.findAllFromForum,
middlewares.forums.privileges.canChangeTopics,
function getCsv (req, res, next) {
  api.comments.populateTopics(req.topics)
    .then((topicsComments) => {
      const commentsData = [ titles ]

      topicsComments.forEach((topic) => {
        topic.comments.forEach((comment) => {
          (comment.replies.length === 0 ? [emptyReply] : comment.replies)
            .forEach((reply) => {
              commentsData.push([
                topic.id,
                `"${escapeTxt(topic.mediaTitle)}"`,
                fullUrl(topic.id, req.forum.name),
                comment.id,
                `"${escapeTxt(moment(comment.createdAt, '', req.locale).format('LL'))}"`,
                `"${escapeTxt(moment(comment.createdAt, '', req.locale).format('LT'))}"`,
                comment.createdAt,
                `"${escapeTxt(comment.text)}"`,
                `"${escapeTxt(comment.author.fullName)}"`,
                reply.id,
                `"${(reply.createdAt && escapeTxt(moment(reply.createdAt, '', req.locale).format('LL')))}"`,
                `"${(reply.createdAt && escapeTxt(moment(reply.createdAt, '', req.locale).format('LT')))}"`,
                reply.createdAt,
                `"${escapeTxt(reply.text)}"`,
                `"${escapeTxt(reply.author.fullName)}"`
              ])
            })
        })
      })

      json2csv(commentsData, function (err, csv) {
        if (err) throw new Error('comments.csv: array to csv error')
        res.status(200)
        res.set({
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename=' + req.forum.name.replace(/\s/g, '-') + '.csv'
        })
        res.write(csv)
        res.end()
      }, { prependHeader: false })
    }).catch(next)
})
