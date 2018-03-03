const config = require('lib/config')
const execAll = require('lib/utils/exec-all')

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
  canEdit (forum, user, topic) {
    if (!config.multiForum && user && user.staff) return true

    const isAdmin =
      forum.isOwner(user) ||
      forum.hasRole(user, 'admin', 'collaborator')

    if (forum.hasVisibility('collaborative')) {
      if (isAdmin && forum.hasRole(topic.owner, 'admin', 'collaborator', 'author')) return true
      if (topic.isOwner(user)) return true
      return false
    }
    if (isAdmin) return true
    if (forum.hasRole(user, 'author') && topic.draft) return true
    return false
  },

  canDelete (forum, user, topic) {
    if (!config.multiForum && user && user.staff) return true
    if (forum.isOwner(user) || forum.hasRole(user, 'admin')) return true
    if (forum.hasRole(user, 'author') && topic.draft) return true
    if (forum.hasVisibility('collaborative') && topic.isOwner(user)) return true
    return false
  },

  canVote (forum, user, topic) {
    if (forum.hasVisibility('public', 'collaborative')) return true
    if (!config.multiForum && user && user.staff) return true
    return forum.isOwner(user) || forum.hasRole(user)
  },

  canComment (forum, user, topic) {
    if (forum.hasVisibility('public', 'collaborative')) return true
    if (!config.multiForum && user && user.staff) return true
    return forum.isOwner(user) || forum.hasRole(user)
  }
}

/**
 * Retrieve all the privileges of a user on a specific topic.
 */

privileges.all = execAll(privileges)

module.exports = privileges
