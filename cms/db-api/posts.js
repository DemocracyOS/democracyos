const { Types: { ObjectId } } = require('mongoose')
const { log } = require('../../main/logger')
const Post = require('../models/post')
// Requires custom errors saved in main/errors
const {
  ErrMissingParam,
  ErrNotFound,
  ErrParamTooLong
} = require('../../main/errors')
/**
 * Create user
 * @method create
 * @param  {object} post
 * @return {promise}
 */

exports.create = function create (post) {
  log.debug('post db-api create')
  const requiredFields = ['title', 'content']
  // If a required field is empty return custom error
  requiredFields.map((f) => {
    if (isEmpty(post[f])) throw ErrMissingParam(f)
  })
  // If a field with maxLength is longer return custom error
  if (isTooLong(post.title, 120)) throw ErrParamTooLong('title')
  if (post.description && isTooLong(post.description, 225)) throw ErrParamTooLong('description')
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
  return Post
    .findOne({ _id: ObjectId(id) })
    .populate({ path: 'author', select: 'name' })
    .then((post) => {
      if (!post) throw ErrNotFound
      return post
    })
}

/**
 * Get list of posts
 * @method list
 * @param  {object} opts
 * @param  {number} opts.limit
 * @param  {number} opts.page
 * @return {promise}
 */


exports.list = function list ({ filter, limit, page, ids }) {
  log.debug('post db-api list')

  if (filter !== undefined) {
    let filterToJSON = JSON.parse(filter)
    if (filterToJSON.title) {
      filterToJSON.title = { $regex: filterToJSON.title, $options: 'i' }
    }
    return Post.paginate(filterToJSON, { page, limit })
  }
  if (ids) {
    const idsToArray = JSON.parse(ids)
    idsToArray.map((id) => {
      return ObjectId(id)
    })
    return Post.paginate({ '_id': { $in: idsToArray } }, { page, limit })
  }
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
  if (post.title && isTooLong(post.title, 120)) throw ErrParamTooLong('title')
  if (post.description && isTooLong(post.description, 225)) throw ErrParamTooLong('description')
  return Post.findOne({ _id: ObjectId(id) })
    .then((_post) => {
      if (!_post) throw ErrNotFound
      return Object.assign(_post, post).save()
    })
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
    .then((post) => {
      if (!post) throw ErrNotFound
      post.remove()
    })
}

function isEmpty (field) {
  if (field === undefined || field.length === 0) {
    return true
  }
  return false
}

function isTooLong (field, maxLength) {
  if (field.length > maxLength) {
    return true
  }
  return false
}
