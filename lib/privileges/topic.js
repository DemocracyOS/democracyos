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
  canEdit: function canEdit (forum, user, topic) {
    if (!config.multiForum && user && user.staff) return true
    if (forum.hasVisibility('collaborative') &&
      (forum.isOwner(user) || forum.hasRole(user, 'admin', 'collaborator')) &&
      forum.hasRole(topic.owner, 'admin', 'collaborator', 'author')) return true
    if (forum.hasRole(user, 'author') && topic.draft) return true
    if (forum.hasVisibility('collaborative') && topic.isOwner(user)) return true
    return false
  },

  canDelete: function canDelete (forum, user, topic) {
    if (!config.multiForum && user && user.staff) return true
    if (forum.isOwner(user) || forum.hasRole(user, 'admin')) return true
    if (forum.hasRole(user, 'author') && topic.draft) return true
    return topic.isOwner(user) && forum.hasVisibility('collaborative')
  }
}

/**
 * Retrieve all the privileges of a user on a specific topic.
 */

privileges.all = execAll(privileges)

module.exports = privileges
