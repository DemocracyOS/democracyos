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
  'Topic URL'
]

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

app.get('/topics.csv',
middlewares.users.restrict,
middlewares.forums.findByName,
middlewares.topics.findAllFromForum,
middlewares.forums.privileges.canChangeTopics,
function getCsv (req, res, next) {
  const infoTopics = [ titles.concat(
    req.forum.topicsAttrs.map(attr => attr.title)
  )]
  const attrsNames = req.forum.topicsAttrs
    .map(attr => attr.name)

  req.topics.forEach((topic) => {
    if (topic.attrs === undefined){
      topic.attrs = {}
    }
    infoTopics.push([
      topic.id,
      `"${escapeTxt(topic.mediaTitle)}"`,
      fullUrl(topic.id, req.forum.name),
      ].concat(attrsNames.map(name => topic.attrs[name] || '')))
  })

  json2csv(infoTopics, function (err, csv) {
    if (err)  {
      throw new Error('topics.csv: array to csv error')
    }
    res.status(200)
    res.set({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename=' + req.forum.name.replace(/\s/g, '-') + '.csv'
    })
    res.write(csv)
    res.end()
  }, { prependHeader: false })
})