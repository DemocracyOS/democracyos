var config = require('lib/config')
var api = require('lib/db-api')

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
  var options = {}
  if (req.user.privileges.canCreate) {
    req.user.privileges.canManage = true
    return next()
  } else if (!config.multiForum) {
    options['name'] = config.defaultForum
  }

  options['privileges.canChangeTopics'] = req.user

  api.forum.all(options, function (err, forums) {
    if (err) return next(err)
    req.user.privileges.canManage = !!forums.length
    next()
  })
}
