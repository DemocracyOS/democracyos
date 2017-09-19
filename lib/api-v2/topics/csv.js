const express = require('express')
const debug = require('debug')
const json2csv = require('json-2-csv').json2csv
const csv2json = require('json-2-csv').csv2json
const config = require('lib/config')
const urlBuilder = require('lib/url-builder')
const middlewares = require('../middlewares')
const api = require('../db-api')

const log = debug('democracyos:api:topic:csv')
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
  const infoTopics = [ titles.concat(req.forum.topicsAttrs.map((attr) => attr.title)) ]
  const attrsNames = req.forum.topicsAttrs
    .map((attr) => attr.name)

  req.topics.forEach((topic) => {
    if (topic.attrs === undefined) {
      topic.attrs = {}
    }
    infoTopics.push([
      topic.id,
      `"${escapeTxt(topic.mediaTitle)}"`,
      fullUrl(topic.id, req.forum.name)
    ].concat(attrsNames.map((name) => topic.attrs[name] || '')))
  })

  json2csv(infoTopics, function (err, csv) {
    if (err) {
      log('get csv: array to csv error', err)
      return res.status(500).end()
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

app.post('/topics.csv',
middlewares.users.restrict,
function postCsv (req, res) {
  const body = req.body.csv
  csv2json(body, function (err, json) {
    if (err) {
      log('get csv: array to csv error', err)
      return res.status(500).end()
    }
    console.log(json)
    res.status(200)
    res.end()
  })
})
