const logger = require('logger')
const Consultation = require('../models/consultation')

/**
 * Create user
 * @method create
 * @param  {object} consultation
 * @return {promise}
 */

exports.create = function create (consultation) {
  logger.debug('create consultation')
  return (new Consultation(consultation)).save()
}

/**
 * Get consultation by id
 * @method get
 * @param  {string} id
 * @return {promise}
 */

exports.get = function get (id) {
  logger.debug('get consultation')
  return Consultation.find({ _id: id })
}

/**
 * Get list of consultations
 * @method list
 * @param  {object} opts
 * @param  {number} opts.limit
 * @param  {number} opts.page
 * @return {promise}
 */

exports.list = function list ({ limit, page }) {
  logger.debug('get consultations list')
  return Consultation
    .paginate({}, { page, limit })
}

/**
 * Update consultation
 * @method update
 * @param  {object} opts
 * @param  {string} opts.id
 * @param  {object} opts.consultation
 * @return {promise}
 */

exports.update = function update ({ id, consultation }) {
  logger.debug('update consultation')
  // return Promise.resolve()
  return Consultation.find({ _id: id })
    .then((_consultation) => Object.assign(_consultation, consultation).save())
}

/**
 * Remove consultation
 * @method delete
 * @param  {string} id
 * @return {promise}
 */

exports.remove = function remove (id) {
  logger.debug('remove consultation')
  return Consultation.find({ _id: id })
    .then((consultation) => consultation.remove())
}
