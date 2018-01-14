const { log } = require('../../logger')
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
 * @param  {string} id
 * @return {promise}
 */

exports.get = function get (id) {
  log.debug('user db-api get')

  return User.find({ _id: id })
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

  return User.find({ _id: id })
    .then((_user) => Object.assign(_user, user).save())
}

/**
 * Remove user
 * @method delete
 * @param  {string} id
 * @return {promise}
 */

exports.remove = function remove (id) {
  log.debug('user db-api remove')

  return User.find({ _id: id })
    .then((user) => user.remove())
}
