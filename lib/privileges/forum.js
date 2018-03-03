const config = require('lib/config')
const execAll = require('lib/utils/exec-all')

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
    if (forum.hasVisibility('public', 'closed', 'collaborative')) return true
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

  canCreateTopics: function canCreateTopics (forum, user) {
    if (!config.multiForum && user && user.staff) return true
    if (forum.hasVisibility('collaborative')) return true
    return forum.isOwner(user) || forum.hasRole(user, 'admin', 'collaborator', 'author')
  },

  canChangeTopics: function canChangeTopics (forum, user) {
    if (!config.multiForum && user && user.staff) return true
    return forum.isOwner(user) || forum.hasRole(user, 'admin', 'collaborator', 'author')
  },

  canPublishTopics: function canPublishTopics (forum, user) {
    if (!config.multiForum && user && user.staff) return true
    if (forum.hasVisibility('collaborative')) return true
    return forum.isOwner(user) || forum.hasRole(user, 'admin')
  },

  canDeleteComments: function canDeleteComments (forum, user) {
    if (!config.multiForum && user && user.staff) return true
    if (config.moderatorEnabled && forum.hasRole(user, 'moderator')) return true
    return forum.isOwner(user) || forum.hasRole(user, 'admin')
  }
}

/**
 * Retrieve all the privileges of a user on a specific forum.
 */

privileges.all = execAll(privileges)

module.exports = privileges
