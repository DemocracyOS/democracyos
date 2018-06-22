const Forum = require('lib/models').Forum

/**
 * Default find Method, to be used in favor of Model.find()
 * @method find
 * @param  {object} query - mongoose query options
 * @return {Mongoose Query}
 */
const find = (query) => {
  return Forum.find(Object.assign({
    deletedAt: null
  }, query))
}

const edit = (query, args) => {
  return Forum
    .findOneAndUpdate(query, args, { new: true })
}

exports.edit = edit
exports.find = find
