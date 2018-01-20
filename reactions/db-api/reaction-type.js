const { log } = require('../../logger')
const ReactionType = require('../models/reaction-type')

/**
 * Create ReactionType
 * @method create
 * @param  {object} ReactionType
 * @return {promise}
 */

exports.create = function create (reactionType) {
  log.debug('create ReactionType')
  return (new ReactionType(reactionType)).save()
}

/**
 * Get ReactionType by id
 * @method get
 * @param  {string} id
 * @return {promise}
 */

exports.get = function get (id) {
  log.debug('get ReactionType')
  return ReactionType.find({ _id: id })
}

/**
 * Get list of ReactionTypes
 * @method list
 * @param  {object} opts
 * @param  {number} opts.limit
 * @param  {number} opts.page
 * @return {promise}
 */

exports.list = function list({ limit, page }) {
  log.debug('get ReactionType list')
  return ReactionType.paginate({}, { page, limit })
}

/**
 * Update ReactionType
 * @method update
 * @param  {object} opts
 * @param  {string} opts.id
 * @param  {object} opts.ReactionType
 * @return {promise}
 */

exports.update = function update ({ id, reactionType }) {
  log.debug('update ReactionType')
  // return Promise.resolve()
  return ReactionType.find({ _id: id })
    .then((_ReactionType) => Object.assign(_ReactionType, reactionType).save())
}

/**
 * Remove ReactionType
 * @method delete
 * @param  {string} id
 * @return {promise}
 */

exports.remove = function remove (id) {
  log.debug('remove ReactionType')
  return ReactionType.find({ _id: id })
    .then((ReactionType) => ReactionType.remove())
}
