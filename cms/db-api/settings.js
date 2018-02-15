const { Types: { ObjectId } } = require('mongoose')
const { log } = require('../../main/logger')
const Setting = require('../models/setting')

/**
 * Create setting
 * @method create
 * @param  {object} setting
 * @return {promise}
 */

exports.create = function create (setting) {
  log.debug('setting db-api create')

  return (new Setting(setting)).save()
}

/**
 * Get setting by id
 * @method get
 * @param  {string} id
 * @return {promise}
 */

exports.get = function get (id) {
  log.debug('setting db-api get')
  return Setting.findOne({ _id: ObjectId(id) })
}

/**
 * Get list of settings
 * @method list
 * @param  {object} opts
 * @param  {number} opts.limit
 * @param  {number} opts.page
 * @return {promise}
 */

exports.list = function list ({ limit, page }) {
  log.debug('settings db-api list')

  return Setting
    .paginate({}, { page, limit })
}

/**
 * Update setting
 * @method update
 * @param  {object} opts
 * @param  {string} opts.id
 * @param  {object} opts.setting
 * @return {promise}
 */

exports.update = function update ({ id, setting }) {
  log.debug('setting db-api update')

  return Setting.findOne({ _id: ObjectId(id) })
    .then((_setting) => Object.assign(_setting, setting).save())
}

/**
 * Remove setting
 * @method delete
 * @param  {string} id
 * @return {promise}
 */

exports.remove = function remove (id) {
  log.debug('setting db-api remove')

  return Setting.findOne({ _id: ObjectId(id) })
    .then((setting) => setting.remove())
}

/**
 * Get one setting
 * @method get
 * @return {promise}
 */

exports.getOne = function getOne () {
  log.debug('setting db-api get one')
  return Setting.findOne({})
}
