const logger = require('logger')
const ReactionVote = require('../models/reaction-vote')

/**
 * Create reactionVote
 * @method create
 * @param  {object} reactionVote
 * @return {promise}
 */

exports.create = function create(reactionVote) {
    logger.debug('create reactionVote')
    return (new ReactionVote(reactionVote)).save()
}

/**
 * Get reactionVote by id
 * @method get
 * @param  {string} id
 * @return {promise}
 */

exports.get = function get(id) {
    logger.debug('get reactionVote')
    return reactionVote.find({ _id: id })
}

/**
 * Get list of reactionVotes
 * @method list
 * @param  {object} opts
 * @param  {number} opts.limit
 * @param  {number} opts.page
 * @return {promise}
 */

exports.list = function list({ limit, page }) {
    logger.debug('get reactionVote list')
    return reactionVote
        .paginate({}, { page, limit })
}

/**
 * Update reactionVote
 * @method update
 * @param  {object} opts
 * @param  {string} opts.id
 * @param  {object} opts.reactionVote
 * @return {promise}
 */

exports.update = function update({ id, reactionVote }) {
    logger.debug('update reactionVote')
    // return Promise.resolve()
    return reactionVote.find({ _id: id })
        .then((_reactionVote) => Object.assign(_reactionVote, reactionVote).save())
}

/**
 * Remove reactionVote
 * @method delete
 * @param  {string} id
 * @return {promise}
 */

exports.remove = function remove(id) {
    logger.debug('remove reactionVote')
    return reactionVote.find({ _id: id })
        .then((reactionVote) => reactionVote.remove())
}
