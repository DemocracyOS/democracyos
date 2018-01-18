const { log } = require('logger')
const Community = require('../models/community')

/**
 * Create community
 * @method create
 * @param  {object} community
 * @return {promise}
 */

exports.create = function create (community) {
  log.debug('create community')
  return (new Community(community)).save()
}

/**
 * Get community by id
 * @method get
 * @param  {string} id
 * @return {promise}
 */

exports.get = function get (id) {
  log.debug('get community')
  return Community.find({ _id: id })
}

/**
 * Update community
 * @method update
 * @param  {object} opts
 * @param  {string} opts.id
 * @param  {object} opts.community
 * @return {promise}
 */

exports.update = function update ({ id, community }) {
  log.debug('update community')

  return Community.find({ _id: id })
    .then((_community) => Object.assign(_community, community).save())
}

/**
 * Remove community
 * @method delete
 * @param  {string} id
 * @return {promise}
 */

exports.remove = function remove (id) {
  log.debug('remove community')
  return Community.find({ _id: id })
    .then((community) => community.remove())
}
