/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Tag = mongoose.model('Tag')
  , log = require('debug')('democracyos:db-api:tag');

/**
 * Get all tags
 *
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'tags' list of items found or `undefined`
 * @return {Module} `tag` module
 * @api public
 */

exports.all = function all(fn) {
  log('Looking for all tags.');

  Tag.find(function (err, tags) {
    if (err) {
      log('Found error %j', err)
      return fn(err);
    }

    log('Delivering tags %j', tags.map(function(tag) { return tag.id; }))
    fn(null, tags);
  });

  return this;
};

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

exports.search = function search(query, fn) {
  var hashQuery = new RegExp('.*' + query + '.*','i');

  log('Searching for tags matching %s', hashQuery);
  Tag.find({ hash: hashQuery }, function(err, tags) {
    if (err) {
      log('Found error: %j', err);
      return fn(err);
    }

    log('Found tags %j for %s', tags, hashQuery)
    fn(null, tags);
  });

  return this;
};

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

exports.searchOne = function searchOne(query, fn) {
  var hashQuery = new RegExp(query, 'i');

  log('Searching for single tag matching %s', hashQuery);
  Tag.findOne({ hash: hashQuery }, function (err, tag) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    }

    log('Delivering tag %j', tag);
    fn(null, tag);
  })

  return this;
};

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
      log('Found error %j', err);
      return fn(err);
    }

    log('Delivering tag %j', tag);
    fn(null, tag)
  })

  return this;
};

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

exports.create = function create(tag, fn) {
  log('Creating new tag %j', tag);


  if ('string' === typeof tag) {
    tag = { name: tag }
  };

  if ('string' !== typeof tag.name) {
    log('Delivering validation error.');

    var errMsg = 'Tag name should be string. '
      + typeof tag.name
      + ' provided.';

    var err = {};
    err.message = errMsg;
    err.name = 'Validation error.';

    return fn(err);
  };

  if ('string' !== typeof tag.hash) {
    log('New tag with undefined hash; creating hash from normalized name');
    tag.hash = normalize(tag.name);
  }

  (new Tag(tag)).save(function (err, saved) {
    if (err) {
      if (11000 == err.code) {
        log('Attempt duplication.');
        exports.searchOne(tag.hash, fn);
      } else {
        log('Found error %j', err);
        fn(err);
      }

      return;
    };

    log('Delivering tag %j', saved);
    fn(null, saved);
  });

  return this;
};

/**
 * Normalizes a given string.
 * E.g.: 'This Cool String' would result 'this-cool-string'
 * @param  {String} value String to be normalized
 * @return {String}      Normalized string
 */
function normalize(value) {
  return value.trim()
    .toLowerCase()
    .replace(/\s+/g,'-')
    .replace(/[àáâãäå]/g,'a')
    .replace(/æ/g,'ae')
    .replace(/ç/g,'c')
    .replace(/[èéêë]/g,'e')
    .replace(/[ìíîï]/g,'i')
    .replace(/ñ/g,'n')                        
    .replace(/[òóôõö]/g,'o')
    .replace(/œ/g,'oe')
    .replace(/[ùúûü]/g,'u')
    .replace(/[ýÿ]/g,'y')
    .replace(/-+/g,'_')
    .replace(/\W/g,'')
    .replace(/_+/g,'-')
    .replace(/^-/,'')
    .replace(/-$/,'')
    .substring(0,139); //No longer than a tweet ;)
}

/**
 * Map array of objects by `property`
 *
 * @param {Array} source array of objects to map
 * @param {String} property to map from objects
 * @return {Array} array of listed properties
 * @api private
 */

function mapByProperty (source, property) {
  return source.map(function(item) { return item[prop]; });
}