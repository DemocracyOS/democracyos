const { Types: { ObjectId } } = require('mongoose')
const { log } = require('../../services/logger')
const Settings = require('../models/setting')

/**
 * Create settings
 * @method create
 * @param  {object} settings
 * @return {promise}
 */

exports.create = function create (settings) {
  log.debug('db-api settings create')
  return (new Settings(settings)).save()
}

/**
 * Get settings by id
 * @method get
 * @param  {string} id
 * @return {promise}
 */

exports.get = function get (id) {
  log.debug('db-api settings get')
  return Settings.findOne({ _id: ObjectId(id) })
}

/**
 * Update settings
 * @method update
 * @param  {object} opts
 * @param  {string} opts.id
 * @param  {object} opts.settings
 * @return {promise}
 */

exports.update = function update ({ id, settings }) {
  log.debug('db-api settings update')

  return Settings.findOne({ _id: ObjectId(id) })
    .then((_settings) => Object.assign(_settings, settings).save())
}

/**
 * Remove settings
 * @method delete
 * @param  {string} id
 * @return {promise}
 */

exports.remove = function remove (id) {
  log.debug('db-api settings remove')
  return Settings.findOne({ _id: ObjectId(id) })
    .then((settings) => settings.remove())
}
