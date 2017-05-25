var config = require('lib/config')
var api = require('lib/db-api')
var privileges = require('lib/privileges/forum')

module.exports.initPrivileges = function (req, res, next) {
  if (req.user) req.user.privileges = {}
  next()
}

module.exports.canCreate = function (req, res, next) {
  if (config.restrictForumCreation || !config.multiForum) {
    req.user.privileges.canCreate = req.user.staff
  } else {
    req.user.privileges.canCreate = true
  }

  next()
}

module.exports.canManage = function (req, res, next) {
  if (req.user.privileges.canCreate) {
    req.user.privileges.canManage = true
    return next()
  } else if (!config.multiForum) {
    if (req.defaultForum) {
      api.forum.findOneByName(req.defaultForum, function (err, forum) {
        if (err) return next(err)
        req.user.privileges.canManage = privileges
        .canChangeTopics(forum, req.user)
        next()
      })
    } else {
      next(new Error('Only STAFF members are allowed to entry before DemocracyOS is initialized.'))
    }
  } else {
    var options = {}
    options['privileges.canChangeTopics'] = req.user

    api.forum.all(options, function (err, forums) {
      if (err) return next(err)
      req.user.privileges.canManage = !!forums.length
      next()
    })
  }
}
