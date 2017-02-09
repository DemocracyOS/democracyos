var config = require('lib/config')

/**
* Privileges are the calculated actions users can make.
*
* These are calculated verifying:
* + Forum Visibility
* + If User is owner of a forum
* + User Role on Forum Permissions
*
*/

var privileges = {
  canView: function canView (forum, user) {
    if (!config.multiForum && user && user.staff) return true
    if (forum.hasVisibility('public', 'closed')) return true
    return forum.isOwner(user) || forum.hasRole(user)
  },

  canEdit: function canEdit (forum, user) {
    if (!config.multiForum && user && user.staff) return true
    return forum.isOwner(user) || forum.hasRole(user, 'admin')
  },

  canDelete: function canDelete (forum, user) {
    if (!config.multiForum && user && user.staff) return true
    return forum.isOwner(user)
  },

  canVoteAndComment: function canVoteAndComment (forum, user) {
    if (forum.hasVisibility('public')) return true
    if (!config.multiForum && user && user.staff) return true
    return forum.isOwner(user) || forum.hasRole(user)
  },

  canChangeTopics: function canChangeTopics (forum, user) {
    if (!config.multiForum && user && user.staff) return true
    return forum.isOwner(user) || forum.hasRole(user, 'admin', 'collaborator')
  },

  canDeleteComments: function canDeleteComments (forum, user) {
    if (!config.multiForum && user && user.staff) return true
    return forum.isOwner(user) || forum.hasRole(user, 'moderator')
  }
}

/**
* Helper function 'all' generator to retrieve all the privileges of a user
* on a specific forum.
*/

privileges.all = (function () {
  var keys = Object.keys(privileges)
  return function all (forum, user) {
    var p = {}

    keys.forEach((k) => {
      p[k] = privileges[k](forum, user)
    })

    return p
  }
})()

module.exports = privileges
