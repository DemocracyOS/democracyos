const logger = require('logger')
const Community = require('../models/community')

/**
 * Create community
 * @method create
 * @param  {object} community
 * @return {promise}
 */

exports.create = function create (Community) {
  logger.debug('create community')
  return (new Community(community)).save()
}

/**
 * Get community by id
 * @method get
 * @param  {string} id
 * @return {promise}
 */

exports.get = function get (id) {
  logger.debug('get community')
  return community.find({ _id: id })
}

/**
 * Update community
 * @method update
 * @param  {object} opts
 * @param  {string} opts.id
 * @param  {object} opts.community
 * @return {promise}
 */

exports.update = function update ({ id,community }) {
  logger.debug('update community')
  // return Promise.resolve()
  return community.find({ _id: id })
    .then((_community) => Object.assign(_community, community).save())
}

/**
 * Remove community
 * @method delete
 * @param  {string} id
 * @return {promise}
 */

exports.remove = function remove (id) {
  logger.debug('remove community')
  return Community.find({ _id: id })
    .then((community) => community.remove())
}
