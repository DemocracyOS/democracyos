const express = require('express')
const Forum = require('lib/api-v2/db-api').forums
const Topic = require('lib/models').Topic
const scopes = require('lib/api-v2/db-api/topics/scopes')
const ObjectID = require('mongodb').ObjectID
const privileges = require('lib/privileges/forum')

const app = module.exports = express()

app.get('/',
function getFeed (req, res, next) {
  let forumsNames = ['voluntariado', 'consultas', 'presupuesto', 'desafios', 'ideas']
  Forum.find({ name: { $in: forumsNames } })
    .then((forumsM) => {
      Topic.aggregate([
        { $match: { forum: { $in: forumsM.map((f) => f._id) } } },
        { $sort: { 'createdAt': -1 } },
        { $sort: { 'participantsCount': -1 } },
        { $group: { _id: '$forum', topics: { $push: '$$ROOT' } } },
        { $project: { best_topics: { $slice: [ '$topics', 2 ] } } },
        { $unwind: '$best_topics' },
        { $replaceRoot: { newRoot: '$best_topics' } }
      ], function (err, topicsM) {
        if (err) {
          res.json({ result: null })
        } else {
          const topicsIds = topicsM.map((topic) => ObjectID(topic._id))
          Topic.find({ _id: { $in: topicsIds } })
            .populate(scopes.ordinary.populate)
            .select(scopes.ordinary.select).exec()
            .then((topics) => topics.map((topic) => {
              return scopes.ordinary.expose(topic, forumsM.find((f) => f._id.toString() === topic.forum.toString()), req.user)
            }))
            .then((topics) => {
              const forums = forumsM.map((f) => {
                let forum = f.toJSON()
                forum.privileges = privileges.all(f, req.user)
                return forum
              })
              res.json({ result: { topics, forums } })
            })
            .catch((err) => {
              console.log(err)
              res.json({ result: null })
            })
        }
      })
    })
    .catch((err) => {
      console.log(err)
      res.json({ result: null })
    })
})
