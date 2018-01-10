const logger = require('logger')
const ReactionInstance = require('../models/reaction-instance')

/**
 * Create reactionInstance
 * @method create
 * @param  {object} reactionInstance
 * @return {promise}
 */

exports.create = function create(reactionInstance) {
    logger.debug('create reactionInstance')
    return (new ReactionInstance(reactionInstance)).save()
}

/**
 * Get reactionInstance by id
 * @method get
 * @param  {string} id
 * @return {promise}
 */

exports.get = function get(id) {
    logger.debug('get reactionInstance')
    return reactionInstance.find({ _id: id })
}

/**
 * Get list of reactionInstances
 * @method list
 * @param  {object} opts
 * @param  {number} opts.limit
 * @param  {number} opts.page
 * @return {promise}
 */

exports.list = function list({ limit, page }) {
    logger.debug('get reactionInstance list')
    return reactionInstance
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

exports.update = function update({ id, reactionInstance }) {
    logger.debug('update reactionInstance')
    // return Promise.resolve()
    return reactionInstance.find({ _id: id })
        .then((_reactionInstance) => Object.assign(_reactionInstance, reactionInstance).save())
}

/**
 * Remove reactionInstance
 * @method delete
 * @param  {string} id
 * @return {promise}
 */

exports.remove = function remove(id) {
    logger.debug('remove reactionInstance')
    return reactionInstance.find({ _id: id })
        .then((reactionInstance) => reactionInstance.remove())
}
