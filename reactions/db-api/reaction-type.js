const logger = require('logger')
const ReactionType = require('../models/reaction-type')

/**
 * Create reactionType
 * @method create
 * @param  {object} reactionType
 * @return {promise}
 */

exports.create = function create(reactionType) {
    logger.debug('create reactionType')
    return (new ReactionType(reactionType)).save()
}

/**
 * Get reactionType by id
 * @method get
 * @param  {string} id
 * @return {promise}
 */

exports.get = function get(id) {
    logger.debug('get reactionType')
    return reactionType.find({ _id: id })
}

/**
 * Get list of reactionTypes
 * @method list
 * @param  {object} opts
 * @param  {number} opts.limit
 * @param  {number} opts.page
 * @return {promise}
 */

exports.list = function list({ limit, page }) {
    logger.debug('get reactionType list')
    return reactionType
        .paginate({}, { page, limit })
}

/**
 * Update reactionType
 * @method update
 * @param  {object} opts
 * @param  {string} opts.id
 * @param  {object} opts.reactionType
 * @return {promise}
 */

exports.update = function update({ id, reactionType }) {
    logger.debug('update reactionType')
    // return Promise.resolve()
    return reactionType.find({ _id: id })
        .then((_reactionType) => Object.assign(_reactionType, reactionType).save())
}

/**
 * Remove reactionType
 * @method delete
 * @param  {string} id
 * @return {promise}
 */

exports.remove = function remove(id) {
    logger.debug('remove reactionType')
    return reactionType.find({ _id: id })
        .then((reactionType) => reactionType.remove())
}
