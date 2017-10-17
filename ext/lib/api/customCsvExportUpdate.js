const express = require('express')
const debug = require('debug')
const json2csv = require('json-2-csv').json2csv
const csv2json = require('json-2-csv').csv2json
const Topic = require('lib/models').Topic
const getIdString = require('lib/utils').getIdString
const middlewares = require('lib/api-v2/middlewares')

const log = debug('democracyos:api:topic:csv')
const app = module.exports = express()

const titles = [
  'Distrito',
  'Numero de Proyecto',
  'Titulo',
  'Area Barrial',
  'Monto',
  'Secretaria',
  'Descripcion',
  'Topic Id'
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
    const infoTopics = [titles]

    req.topics.forEach((topic) => {
      if (topic.attrs === undefined) {
        topic.attrs = {}
      }
      infoTopics.push([
        `${escapeTxt(topic.attrs.district)}`.toUpperCase(),
        `${escapeTxt(topic.attrs.number)}`,
        `${escapeTxt(topic.mediaTitle)}`,
        `${escapeTxt(topic.attrs.area)}`,
        `${escapeTxt(topic.attrs.budget)}`,
        `${escapeTxt('DESCONOCIDO')}`,
        `${escapeTxt(topic.attrs.description)}`,
        topic.id
      ])
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
  middlewares.forums.findFromQuery,
  middlewares.forums.privileges.canChangeTopics,
  function postCsv (req, res) {
    const body = req.body.csv
    csv2json(body, function (err, json) {
      if (err) {
        log('get csv: array to csv error', err)
        return res.status(500).end()
      }
      //console.log(json)
      //const attrs = req.forum.topicsAttrs
      Topic.find({ _id: { $in: json.map((t) => t['Topic Id']) } })
        .then((topics) => {
          return Promise.all(
            topics.map((topic) => {
              const _topic = json.find((t) => {
                return t['Topic Id'] === getIdString(topic._id)
              })

              let votes = _topic[' Cantidad Votos']
              let winner = _topic[' incluido (SI/NO)']

              topic.set('attrs.votes', votes)

              if (winner === 'SI') {
                topic.set('attrs.state', 'pendiente')
              } else {
                topic.set('attrs.state', 'perdedor')
              }

              //attrs.forEach((attr) => {
                //if (!_topic[attr.name]) {
                  //switch (attr.kind) {
                    //case 'Number':
                      //_topic[attr.name] = 0
                      //break
                    //case 'Enum':
                      //_topic[attr.name] = []
                      //break
                    //case 'String':
                      //_topic[attr.name] = ''
                      //break
                    //default:
                  //}
                //}
                //if (attr.kind === 'String') _topic[attr.name] = _topic[attr.name].replace(/"/g, '')

                //topic.set(`attrs.${attr.name}`, _topic[attr.name])
              //})

              return topic.save()
            })
          )
        }
        )
        .then((topics) => {
          res.status(200).end()
        })
        .catch((err) => {
          log('post csv: find topics error', err)
          res.status(500).end()
        })
    })
  })
