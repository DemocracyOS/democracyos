const objectMap = require('object-map')
const config = require('lib/config')

/**
* Privileges are the calculated actions users can make.
*
* These are calculated verifying:
* + Forum Visibility
* + If User is owner of a forum
* + User Role on Topic Permissions
*
*/

var privileges = {
  canEdit: function canEdit (forum, user, topic) {
    if (!config.multiForum && user && user.staff) return true
    if (forum.isOwner(user) || forum.hasRole(user, 'admin')) return true
    return forum.hasRole(user, 'author') && topic.draft
  },

  canDelete: function canDelete (forum, user, topic) {
    if (!config.multiForum && user && user.staff) return true
    if (forum.isOwner(user) || forum.hasRole(user, 'admin')) return true
    return forum.hasRole(user, 'author') && topic.draft
  }
}

/**
* Helper function 'all' generator to retrieve all the privileges of a user
* on a specific topic.
*/

privileges.all = function all (forum, user, topic) {
  return objectMap(privileges, (p) => p(forum, user, topic))
}

module.exports = privileges
