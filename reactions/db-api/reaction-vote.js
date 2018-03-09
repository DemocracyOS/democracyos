const { Types: { ObjectId } } = require('mongoose')
const { log } = require('../../main/logger')
const ReactionVote = require('../models/reaction-vote')

/**
 * Create reactionVote
 * @method create
 * @param  {object} reactionVote
 * @return {promise}
 */

exports.create = function create (reactionVote) {
  log.debug('create reactionVote')
  return (new ReactionVote(reactionVote)).save()
}

/**
 * Get reactionVote by id
 * @method get
 * @param  {string} id
 * @return {promise}
 */

exports.get = function get (id) {
  log.debug('get reactionVote')
  return ReactionVote.findOne({ _id: ObjectId(id) })
}

/**
 * Get list of reactionVotes
 * @method list
 * @param  {object} opts
 * @param  {number} opts.limit
 * @param  {number} opts.page
 * @return {promise}
 */

exports.list = function list ({ limit, page, ids }) {
  log.debug('get reactionVote list')
  if (ids) {
    const idsToArray = JSON.parse(ids)
    idsToArray.map((id) => {
      return ObjectId(id)
    })
    return ReactionVote.paginate({ '_id': { $in: idsToArray } }, { page, limit })
  }
  return ReactionVote
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

exports.update = function update ({ id, reactionVote }) {
  log.debug('update reactionVote')
  // return Promise.resolve()
  return ReactionVote.findOne({ _id: ObjectId(id) })
    .then((_ReactionVote) => Object.assign(_ReactionVote, reactionVote).save())
}

/**
 * Remove reactionVote
 * @method delete
 * @param  {string} id
 * @return {promise}
 */

exports.remove = function remove (id) {
  log.debug('remove reactionVote')
  return ReactionVote.findOne({ _id: ObjectId(id) })
    .then((ReactionVote) => ReactionVote.remove())
}

/**
 * Get list of reactionVotes from User (not closed)
 *   Param: UserId
 */
