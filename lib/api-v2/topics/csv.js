const express = require('express')
const debug = require('debug')
const json2csv = require('json-2-csv').json2csv
const csv2json = require('json-2-csv').csv2json
const Topic = require('lib/models').Topic
const getIdString = require('lib/utils').getIdString
const middlewares = require('../middlewares')

const log = debug('democracyos:api:topic:csv')
const app = module.exports = express()

const titles = [
  'Topic ID',
  'Topic Title'
]

function escapeTxt (text) {
  if (!text) return ''
  text += ''
  return text.replace(/"/g, '\'').replace(/\r/g, '').replace(/\n/g, '')
}

app.get('/topics.csv',
middlewares.users.restrict,
middlewares.forums.findByName,
middlewares.topics.findAllFromForum,
middlewares.forums.privileges.canChangeTopics,
function getCsv (req, res, next) {
  const infoTopics = [ titles.concat(req.forum.topicsAttrs.map((attr) => attr.name)) ]
  const attrsNames = req.forum.topicsAttrs
    .map((attr) => attr.name)

  req.topics.forEach((topic) => {
    if (topic.attrs === undefined) {
      topic.attrs = {}
    }
    infoTopics.push([
      topic.id,
      `"${escapeTxt(topic.mediaTitle)}"`
    ].concat(attrsNames.map((name) => `"${escapeTxt(topic.attrs[name])}"` || '')))
  })

  json2csv(infoTopics, function (err, csv) {
    if (err) {
      log('get csv: array to csv error', err)
      return res.status(500).end()
    }
    res.status(200)
    res.set({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename=${req.forum.name.replace(/\s/g, '-')}-${Math.floor((new Date()) / 1000)}.csv`
    })
    res.write(csv)
    res.end()
  }, { prependHeader: false })
})

app.post('/topics.csv',
middlewares.users.restrict,
middlewares.forums.findFromQuery,
middlewares.forums.privileges.canChangeTopics,
function postCsv (req, res) {
  const body = req.body.csv
  csv2json(body, function (err, json) {
    if (err) {
      log('get csv: array to csv error', err)
      return res.status(500).end()
    }
    console.log(json)
    const attrs = req.forum.topicsAttrs
    Topic.find({ _id: { $in: json.map((t) => t['Topic ID']) } })
      .then((topics) => {
        return Promise.all(
          topics.map((topic) => {
            const _topic = json.find((t) => {
              return t['Topic ID'] === getIdString(topic._id)
            })
            // console.log(_topic)

            attrs.forEach((attr) => {
              if (!_topic[attr.name]) {
                switch (attr.kind) {
                  case 'Number':
                    _topic[attr.name] = 0
                    break
                  case 'Enum':
                    _topic[attr.name] = []
                    break
                  case 'String':
                    _topic[attr.name] = ''
                    break
                }
              }
              if (typeof _topic[attr.name] === 'string') _topic[attr.name] = _topic[attr.name].replace(/"/g, '')

              topic.set(`attrs.${attr.name}`, _topic[attr.name])
            })
            return topic.save()
          })
        )
      })
      .then((topics) => {
        res.status(200).end()
      })
      .catch((err) => {
        log('post csv: find topics error', err)
        res.status(500).end()
      })
  }, { delimiter: { wrap: '"' } })
})
