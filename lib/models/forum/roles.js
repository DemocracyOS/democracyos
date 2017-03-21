const config = require('lib/config')

/**
 * List of roles allowed for forum permissions.
 */

const roles = [
  // 'owner' <= Dont't forget to take into account Owner role, it's defined on forum.owner.
  'admin',
  'collaborator',
  'author',
  'participant'
]

if (config.moderatorEnabled) roles.push('moderator')

module.exports = roles
