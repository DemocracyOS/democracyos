const { Types: { ObjectId } } = require('mongoose')
const { log } = require('../../logger')
const Post = require('../models/post')

/**
 * Create user
 * @method create
 * @param  {object} post
 * @return {promise}
 */

exports.create = function create (post) {
  log.debug('post db-api create')
  return (new Post(post)).save()
}

/**
 * Get post by id
 * @method get
 * @param  {string} id
 * @return {promise}
 */

exports.get = function get (id) {
  log.debug('post db-api get')
  return Post.findOne({ _id: ObjectId(id) })
}

/**
 * Get list of posts
 * @method list
 * @param  {object} opts
 * @param  {number} opts.limit
 * @param  {number} opts.page
 * @return {promise}
 */

exports.list = function list ({ limit, page }) {
  log.debug('post db-api list')
  return Post
    .paginate({}, { page, limit })
}

/**
 * Update post
 * @method update
 * @param  {object} opts
 * @param  {string} opts.id
 * @param  {object} opts.post
 * @return {promise}
 */

exports.update = function update ({ id, post }) {
  log.debug('post db-api update')
  // return Promise.resolve()
  return Post.findOne({ _id: ObjectId(id) })
    .then((_post) => Object.assign(_post, post).save())
}

/**
 * Remove post
 * @method delete
 * @param  {string} id
 * @return {promise}
 */

exports.remove = function remove (id) {
  log.debug('post db-api remove')
  return Post.findOne({ _id: ObjectId(id) })
    .then((post) => post.remove())
}
