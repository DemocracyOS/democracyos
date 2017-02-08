const privileges = require('lib/privileges/forum')
const config = require('lib/config')
const api = require('../db-api')

exports.privileges = {}

Object.keys(privileges).forEach((privilege) => {
  exports.privileges[privilege] = function middleware (req, res, next) {
    if (privileges[privilege](req.forum, req.user)) return next()

    const err = new Error('User doesnt have enough privileges on forum.')
    err.status = 403
    err.code = 'LACK_PRIVILEGES'
    return next(err)
  }

  exports.privileges[privilege].name = `${privilege}Middleware`
})

exports.findFromTopic = function findFromTopic (req, res, next) {
  const id = req.topic.forum
  api.forums.find({ _id: id })
    .findOne()
    .exec()
    .then((forum) => {
      if (!forum) {
        const err = new Error(`Forum ${id} not found.`)
        err.status = 404
        err.code = 'FORUM_NOT_FOUND'
        return next(err)
      }

      req.forum = forum

      next()
    })
    .catch(next)
}

exports.findByForumId = function findByForumId (req, res, next) {
  const name = config.multiForum ? req.query.forum : config.defaultForum
  api.forums.find({ name: name })
    .findOne()
    .exec()
    .then((forum) => {
      if (!forum) {
        const err = new Error(`Forum ${name} not found.`)
        err.status = 404
        err.code = 'FORUM_NOT_FOUND'
        return next(err)
      }

      req.forum = forum

      next()
    })
    .catch(next)
}
