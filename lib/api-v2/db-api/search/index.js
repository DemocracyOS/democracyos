const Forum = require('lib/models').Forum
const scopes = require('../forums/scopes')

/**
 * Default find Method, to be used in favor of Model.find()
 * @method find
 * @param  {object} query - Mongoose query options
 * @return {Mongoose Query}
 */

function find (query) {
  return Forum.find(Object.assign({
    deletedAt: null
  }, query))
}

exports.find = find

exports.searchForum = function search (query) {
  return find(
      { $text: {
        $search: query,
        $caseSensitive: false,
        $diacriticSensitive: false
      } })
      .populate(scopes.ordinary.populate)
      .select(scopes.ordinary.select)
      .exec()
      .then((forums) => forums.map((forum) => {
        return scopes.ordinary.expose(forum)
      }))
}
