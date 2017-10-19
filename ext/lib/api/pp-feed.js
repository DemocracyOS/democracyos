const express = require('express')
const Forum = require('lib/api-v2/db-api').forums
const Topic = require('lib/models').Topic
const scopes = require('lib/api-v2/db-api/topics/scopes')
const ObjectID = require('mongodb').ObjectID
const privileges = require('lib/privileges/forum')

const app = module.exports = express()

app.post('/',
function getFeed (req, res, next) {
  let filters = req.body
  const s = +req.body.s || 0
  delete filters.s
  const validFilters = {
    edad: ['joven', 'adulto'],
    distrito: ['centro', 'noroeste', 'norte', 'oeste', 'sudoeste', 'sur'],
    anio: ['2017', '2018'],
    estado: ['proyectado', 'ejecutandose', 'finalizado', 'pendiente', 'perdedor']
  }

  let isValid = Object.keys(filters)
    .map(filterKey => {
      return filters[filterKey]
        .map(option => !!~validFilters[filterKey].indexOf(option))
        .filter(v => !v)
    })
    .reduce((invalids, f) => invalids.concat(f), []).length === 0
  if (!isValid) return res.json({ result: null, error: 'Filtros inválidos' })

  Forum.find({ name: 'presupuesto' })
    .then((forum) => {
      Topic.aggregate([
        { $sort: { 'attrs.district': 1 } },
        { $match: {
            forum: forum[0]._id,
            deletedAt: null,
            publishedAt: { $ne: null },
            'attrs.edad': { $in: req.body.edad },
            'attrs.district': { $in: req.body.distrito },
            'attrs.anio': { $in: req.body.anio },
            'attrs.state': { $in: req.body.estado }
        }},
        {
          $group: {
            _id: null,
            results: { $push: '$$ROOT' }
          } },
          { $project: {
            topics: { $slice: ['$results', s, 20] }
          }
        }
      ], function (err, results) {
        if (err) {
          return res.json({ result: null, error: err })
        } else if (!results[0]) {
          return res.json({ result: [] })
        } else {
          let topics = results[0].topics.map(topic => ({
            id: topic._id,
            action: topic.action,
            attrs: topic.attrs,
            coverUrl: topic.coverUrl,
            forum: topic.forum,
            mediaTitle: topic.mediaTitle,
            tags: topic.tags
          }))
          res.json({ result: topics })
        }
      })
    })
    .catch((err) => {
      res.json({ result: null, error: err })
    })
})
