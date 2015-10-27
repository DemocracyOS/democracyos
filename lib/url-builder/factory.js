module.exports = function factory(multiForum) {
  return {
    forum: function (forum) {
      if (!multiForum) return '';
      if (!forum) throw new Error('Forum is required.');
      return '/' + forum.name;
    },

    topic: function (topic, forum) {
      if (!topic) throw new Error('Topic is required.');
      var url = multiForum ? this.forum(forum) : '';
      url += '/topic/' + topic.id;
      return url;
    },

    admin: function (forum) {
      if (!multiForum) return '/admin';
      if (!forum) throw new Error('Forum is required.');
      return '/' + forum.name + '/admin';
    },

    comment: function (comment, forum) {
      if (!comment) throw new Error('Comment is required.');
      var url = multiForum ? this.forum(forum) : '';
      url += '/' + forum.name + '/comment';
      return url;
    }
  };
};
