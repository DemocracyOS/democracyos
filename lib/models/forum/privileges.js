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
    if (forum.hasVisibility('public', 'closed')) return true;
    return forum.isOwner(user) || forum.hasRole(user);
  },

  canEdit: function canEdit (forum, user) {
    return forum.isOwner(user) || forum.hasRole(user, 'admin');
  },

  canDelete: function canDelete (forum, user) {
    return forum.isOwner(user);
  },

  canVoteAndComment: function canVoteAndComment (forum, user) {
    if (forum.hasVisibility('public')) return true;
    return forum.isOwner(user) || forum.hasRole(user);
  },

  canChangeTopics: function canChangeTopics (forum, user) {
    return forum.isOwner(user) || forum.hasRole(user, 'admin', 'collaborator');
  }
};

/**
* Helper function 'all' generator to retrieve all the privileges of a user
* on a specific forum.
*/

privileges.all = (function(){
  var keys = Object.keys(privileges);
  return function all (forum, user) {
    var p = {};

    keys.forEach(k => {
      p[k] = privileges[k](forum, user);
    });

    return p;
  };
})();

module.exports = privileges;
