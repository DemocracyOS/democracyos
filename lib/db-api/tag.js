/**
 * Module dependencies.
 */

var log = require('debug')('democracyos:db-api:tag')
var slugify = require('transliteration').slugify
var Tag = require('lib/models').Tag

/**
 * Get all tags
 *
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'tags' list of items found or `undefined`
 * @return {Module} `tag` module
 * @api public
 */

exports.all = function all (fn) {
  log('Looking for all tags.')

  Tag.find(function (err, tags) {
    if (err) {
      log('Found error %j', err)
      return fn(err)
    }

    log('Delivering tags %j', tags.map(function (tag) { return tag.id }))
    fn(null, tags)
  })

  return this
}

/**
 * Search tags from query
 *
 * @param {String} query string to search by `hash`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'tags' list of tags objects found or `undefined`
 * @return {Module} `tag` module
 * @api public
 */

exports.search = function search (query, fn) {
  var hashQuery = new RegExp('.*' + query + '.*', 'i')

  log('Searching for tags matching %s', hashQuery)
  Tag.find({ hash: hashQuery }, function (err, tags) {
    if (err) {
      log('Found error: %j', err)
      return fn(err)
    }

    log('Found tags %j for %s', tags, hashQuery)
    fn(null, tags)
  })

  return this
}

/**
 * Update tag by `id` and `data`
 *
 * @param {ObjectId|String} data to create tag
 * @param {Function} fn callback function
 *   - 'err' error found on query or `null`
 *   - 'tag' item created or `undefined`
 * @return {Module} `tag` module
 * @api public
 */

exports.update = function update (id, data, fn) {
  log('Updating tag %s with %j', id, data)

  exports.get(id, onget)

  function onget (err, tag) {
    if (err) {
      log('Found error %s', err.message)
      return fn(err)
    }

    // update and save tag document with data
    tag.set(data)
    tag.save(onupdate)
  }

  function onupdate (err, tag) {
    if (!err) {
      log('Saved tag %s', tag.id)
      return fn(null, tag)
    }
    log('Found error %s', err)
    return fn(err)
  }

  return this
}

/**
 * Search single tag from query
 *
 * @param {String} query string to search by `hash`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'tag' single tag object found or `undefined`
 * @return {Module} `tag` module
 * @api public
 */

exports.searchOne = function searchOne (query, fn) {
  var hashQuery = new RegExp(query, 'i')

  log('Searching for single tag matching %s', hashQuery)
  Tag.findOne({ hash: hashQuery }, function (err, tag) {
    if (err) {
      log('Found error %j', err)
      return fn(err)
    }

    log('Delivering tag %j', tag)
    fn(null, tag)
  })

  return this
}

/**
 * Get single tag from ObjectId or HexString
 *
 * @param {Mixed} id ObjectId or HexString for Tag
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'tag' single tag object found or `undefined`
 * @return {Module} `tag` module
 * @api public
 */

exports.get = function get (id, fn) {
  log('Looking for tag %j', id)
  Tag.findById(id, function (err, tag) {
    if (err) {
      log('Found error %j', err)
      return fn(err)
    }

    log('Delivering tag %j', tag)
    fn(null, tag)
  })

  return this
}

/**
 * Create or retrieve Tag from `tag` descriptor
 *
 * @param {Object|String} tag object descriptor to use as
 * template for a new Tag or a String with the new Tag's name
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'tag' single tag object found or `undefined`
 * @return {Module} `tag` module
 * @api public
 */

exports.create = function create (tag, fn) {
  log('Creating new tag %j', tag)

  if (typeof tag === 'string') {
    tag = { name: tag }
  }

  if (typeof tag.name !== 'string') {
    log('Delivering validation error.')

    var errMsg = 'Tag name should be string. ' +
    typeof tag.name +
    ' provided.'

    var err = {}
    err.message = errMsg
    err.name = 'Validation error.'

    return fn(err)
  }

  if (!tag.hash) {
    tag.hash = slugify(tag.name)
  }

  (new Tag(tag)).save(function (err, saved) {
    if (err) {
      if (err.code === 11000) {
        log('Attempt duplication.')
        exports.searchOne(tag.hash, fn)
      } else {
        log('Found error %j', err)
        fn(err)
      }

      return
    }

    log('Delivering tag %j', saved)
    fn(null, saved)
  })

  return this
}
