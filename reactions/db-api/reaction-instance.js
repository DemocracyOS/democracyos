const { log } = require('../../logger')
const ReactionInstance = require('../models/reaction-instance')

/**
 * Create reactionInstance
 * @method create
 * @param  {object} reactionInstance
 * @return {promise}
 */

exports.create = function create(reactionInstance) {
  log.debug('create reactionInstance')
  return (new ReactionInstance(reactionInstance)).save()
}

/**
 * Get reactionInstance by id
 * @method get
 * @param  {string} id
 * @return {promise}
 */

exports.get = function get(id) {
  log.debug('get reactionInstance')
  return ReactionInstance.find({ _id: id })
}

/**
 * Get list of reactionInstances
 * @method list
 * @param  {object} opts
 * @param  {number} opts.limit
 * @param  {number} opts.page
 * @return {promise}
 */

exports.list = function list ({ limit, page }) {
  log.debug('get reactionInstance list')
  return ReactionInstance
    .paginate({}, { page, limit })
}

/**
 * Update reactionInstance
 * @method update
 * @param  {object} opts
 * @param  {string} opts.id
 * @param  {object} opts.reactionInstance
 * @return {promise}
 */

exports.update = function update ({ id, reactionInstance }) {
  log.debug('update reactionInstance')
  // return Promise.resolve()
  return ReactionInstance.find({ _id: id })
    .then((_ReactionInstance) => Object.assign(_ReactionInstance, reactionInstance).save())
}

/**
 * Remove reactionInstance
 * @method delete
 * @param  {string} id
 * @return {promise}
 */

exports.remove = function remove (id) {
  log.debug('remove reactionInstance')
  return ReactionInstance.find({ _id: id })
    .then((ReactionInstance) => ReactionInstance.remove())
}

// TODO

/**
 * Get reactionInstance by resourceId 
 */

/**
 * Get list of active reactionInstances (not closed) 
 *   Param: (Opt) dateFrom: Date (Default: start of the current year)
 *   Param: (Opt) dateTo: Date (Default: current day-month-year)
 */

/**
 * Get list of closed reactionInstances in a range of date
 *   Param: (Opt) dateFrom: Date (Default: start of the current year)
 *   Param: (Opt) dateTo: Date (Default: current day-month-year)
 */

