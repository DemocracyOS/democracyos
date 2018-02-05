const { Types: { ObjectId } } = require('mongoose')
const { log } = require('../../main/logger')
const { ErrNotFound } = require('../../main/errors')
const User = require('../models/user')

/**
 * Create user
 * @method create
 * @param  {object} user
 * @return {promise}
 */

exports.create = function create (user) {
  log.debug('user db-api create')

  return (new User(user)).save()
}

/**
 * Get user by id
 * @method get
 * @param  {object} query
 * @return {promise}
 */

const get = exports.get = function get (query) {
  log.debug('user db-api get')
  if (query.id) {
    let _id = ObjectId(query.id)
    if (!ObjectId.isValid(_id)) throw new Error('Invalid id')
    delete query.id
    query._id = _id
  }
  return User.findOne(query)
}

/**
 * Get list of users
 * @method list
 * @param  {object} opts
 * @param  {number} opts.limit
 * @param  {number} opts.page
 * @return {promise}
 */

exports.list = function list ({ limit, page }) {
  log.debug('user db-api list')

  return User
    .paginate({}, { page, limit })
}

/**
 * Update user
 * @method update
 * @param  {object} opts
 * @param  {string} opts.id
 * @param  {object} opts.user
 * @return {promise}
 */

exports.update = function update ({ id, user }) {
  log.debug('user db-api update')

  return get({ id })
    .then((_user) => {
      if (!_user) throw ErrNotFound('User to update not found')
      return Object.assign(_user, user).save()
    })
}

/**
 * Remove user
 * @method delete
 * @param  {string} id
 * @return {promise}
 */

exports.remove = function remove (id) {
  log.debug('user db-api remove')

  return get({ id })
    .then((user) => {
      if (!user) throw ErrNotFound('User to remove not found')
      return user.remove()
    })
}
