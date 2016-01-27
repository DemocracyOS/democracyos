var privileges = {
  canView: function canView (forum, user) {
    if (forum.isOwner(user)) return true;
    if (forum.hasVisibility('public', 'closed')) return true;
    return forum.hasRole(user);
  },

  canVoteAndComment: function canVoteAndComment (forum, user) {
    if (forum.isOwner(user)) return true;
    if (forum.hasVisibility('public')) return true;
    if (forum.hasVisibility('closed') &&
        forum.hasRole(user, 'admin', 'collaborator', 'participant')) return true;
    return false;
  },

  canChangeTopics: function canChangeTopics (forum, user) {
    if (forum.isOwner(user)) return true;
    return forum.hasRole(user, 'admin', 'collaborator');
  },

  canChangePrivileges: function canChangePrivileges (forum, user) {
    return forum.isOwner(user) || forum.hasRole(user, 'admin');
  }
};

/**
* Helper function 'all' generator to retrieve all the privileges of a user.
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
