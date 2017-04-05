const Forum = require('lib/models').Forum
const scopes = require('../forums/scopes')

exports.searchForum = function searchForum (opts, query) {
  opts = opts || {}

  return Forum.find({
    deletedAt: null,
    visibility: { $in: ['public', 'closed'] },
    $text: {
      $search: query,
      $caseSensitive: false,
      $diacriticSensitive: false
    }
  })
    .populate(scopes.ordinary.populate)
    .select(scopes.ordinary.select)
    .limit(opts.limit)
    .skip((opts.page - 1) * opts.limit)
    .exec()
    .then((forums) => forums.map(scopes.ordinary.expose))
}
