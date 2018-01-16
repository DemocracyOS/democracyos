const Forum = require('lib/models').Forum

/**
 * Default find Method, to be used in favor of Model.find()
 * @method find
 * @param  {object} query - mongoose query options
 * @return {Mongoose Query}
 */
function find (query) {
  return Forum.find(Object.assign({
    deletedAt: null
  }, query))
}

exports.find = find

/**
 * Create Forum
 *
 * @param {User} opts.user editor of the topic
 * @param {Forum} opts.forum Forum
 * @param {Object} attrs attributes of the Topic
 * @return {promise}
 * @api public
 */

exports.create = function create (opts, attrs) {
  const user = opts.user
  const forum = opts.forum

  attrs.forum = forum._id
  attrs.owner = user._id

  switch (attrs['action.method']) {
    case 'vote':
      attrs['action.results'] = [{ value: 'positive', percentage: 0 }, { value: 'neutral', percentage: 0 }, { value: 'negative', percentage: 0 }]
      break
    case 'poll':
      if (!attrs['action.options']) {
        return Promise.reject("Can't create a poll without options")
      }
      attrs['action.results'] = attrs['action.options'].map((o) => ({ value: o, percentage: 0 }))
      delete attrs['action.options']
      break
    case 'cause':
      attrs['action.results'] = [{ value: 'support', percentage: 0 }]
      break
    default:
      attrs['action.results'] = []
  }

  const topic = new Topic()

  updateClauses(attrs, topic)
  setAttributes(attrs, topic)

  return topic.save()
    .then((topic) => scopes.ordinary.expose(topic, forum, user))
}
