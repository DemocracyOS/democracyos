const Forum = require('lib/models').Forum
const scopes = require('./scopes')

/**
 * Default find Method, to be used in favor of Model.find()
 * @method find
 * @param  {object} query - Mongoose query options
 * @return {Mongoose Query}
 */
function find (query) {
  return Forum.find(Object.assign({
    context: 'forum'
  }, query))
}

exports.find = find

function search (query) {
  return find(
      { 'title': { '$text': query } })
      .populate(scopes.ordinary.populate)
      .select(scopes.ordinary.select)
      .exec()
      .then((forums) => forums.map((forum) => {
        return scopes.ordinary.expose(forum)
      }))
}

exports.search = search
