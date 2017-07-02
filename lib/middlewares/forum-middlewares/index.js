var log = require('debug')('democracyos:forum:middleware')
var config = require('lib/config')
var api = require('lib/db-api')
var privileges = require('lib/privileges/forum')

// Variable with the defaultForum's name on singleForum
var defaultForum = null

if (!config.multiForum && config.defaultForum) {
  api.forum.findOneByName(config.defaultForum, function (err, forum) {
    if (err) {
      log('There was an error when verifying config.defaultForum option: ', err)
      return process.exit(1)
    }

    if (!forum) {
      log('ERROR: Your config.defaultForum doesn\'t match any forum in your database with name: %s', config.defaultForum)
      return process.exit(1)
    }

    defaultForum = config.defaultForum
  })
}

var exports = module.exports = {}

exports.findForum = function findForum (req, res, next) {
  api.forum.findById(req.params.id, function (err, forum) {
    if (err) {
      log('Error fetching forum: %s', err)
      return res.status(400).send()
    }

    if (!forum) return res.status(404).send()

    req.forum = forum
    next()
  })
}

exports.findForumByName = function findForumByName (req, res, next) {
  api.forum.findOneByName(req.query.name, function (err, forum) {
    if (err) {
      log('Error fetching forum: %s', err)
      return res.status(400).send()
    }

    if (!forum) {
      log(`Forum with name '${req.query.name}' not found.`)
      return res.status(404).send()
    }

    req.forum = forum
    next()
  })
}

exports.findForumById = function findForumById (req, res, next) {
  var id = req.query.forum || (req.body && req.body.forum)

  if (!id) return next()

  api.forum.findById(id, function (err, forum) {
    if (err) {
      log('Error fetching forum: %s', err)
      return res.status(400).send()
    }

    if (!forum) {
      log(`Forum with id '${id}' not found.`)
      return res.status(404).send()
    }

    req.forum = forum
    next()
  })
}

exports.setDefaultForum = function setDefaultForum (req, res, next) {
  if (config.multiForum) return next()

  if (defaultForum) {
    req.defaultForum = defaultForum
    return next()
  }

  api.forum.findOneByName(undefined, function (err, forum) {
    if (err) {
      log(err)
      return res.status(500).send()
    }

    if (forum) {
      req.defaultForum = defaultForum = forum.name
    }

    next()
  })
}

exports.findDefaultForum = function findDefaultForum (req, res, next) {
  if (config.multiForum) return next()

  api.forum.findOneByName(defaultForum, function (err, forum) {
    if (err) {
      log(err)
      return res.status(500).send()
    }

    if (forum) {
      req.defaultForum = defaultForum = forum.name
      req.forum = forum
    }

    next()
  })
}

exports.privileges = function privilegesMiddlewareGenerator (privilege) {
  if (!privileges[privilege]) throw new Error('Wrong privilege name.')

  return function privilegesMiddleware (req, res, next) {
    var forum = req.forum
    var user = req.user

    if (!forum) {
      log('Couldn\'t find forum.')
      return res.status(404).send()
    }

    if (privileges[privilege](forum, user)) return next()

    log(`User tried to make a restricted action. User: ${user && user._id} Forum: ${forum.name} Privilege: ${privilege}`)
    return res.status(401).send()
  }
}

exports.canCreateForum = function canCreateForum (req, res, next) {
  if (config.multiForum) {
    if (!config.restrictForumCreation) return next()
    if (!req.user || !req.user.staff) {
      log('Forums must be created by a staff members only.')
      return res.status(401).send()
    }
  } else {
    if (!req.user || !req.user.staff) {
      log('Single forum must be created by a staff member only')
      return res.status(401).send()
    }
  }
  next()
}
