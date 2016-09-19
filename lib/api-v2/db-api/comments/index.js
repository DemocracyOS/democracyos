var Comment = require('lib/models').Comment
var scopes = require('./scopes')

/**
 * Default find Method, to be used in favor of Model.find()
 * @method find
 * @param  {object} query - mongoose query options
 * @return {Mongoose Query}
 */
function find (query) {
  return Comment.find(Object.assign({
    context: 'topic'
  }, query))
}

/**
 * Get the public listing of comments from a topic
 * @method list
 * @param  {object} query
 * @return {promise}
 */
module.exports.list = function list (query) {
  query = query || {}

  return find()
    .where({reference: query.topicId})
    .populate('author')
    .limit(query.limit)
    .skip(query.page * query.limit)
    .sort(query.sort)
    .select(scopes.ordinary.select)
    .exec()
    .then((comments) => comments.map(scopes.ordinary.expose))
}

/**
 * Get the count of total comments of the public listing
 * @method listCount
 * @param  {[type]}  query [description]
 * @return {[type]}        [description]
 */
module.exports.listCount = function listCount (query) {
  query = query || {}

  return find()
    .where({reference: query.topicId})
    .count()
    .exec()
}
