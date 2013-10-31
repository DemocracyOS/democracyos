/**
 * Module dependencies.
 */

var log = require('debug')('democracyos:account')
  , utils = require('lib/utils')
  , mongoose = require('mongoose')
  , api = require('lib/db-api')
  , jade = require('jade')
  , t = require('t-component')
  , config = require('lib/config')
  ;


/**
 * Updates a citizen
 *
 * @param {Object} formData contains fullname, email, password 
 * @param {Function} callback Callback accepting `err` and `citizen`
 * @api public
 */

exports.updateCitizen = function updateCitizen (citizen, formData, callback) {
  log('About to update citizen : [%s].', citizen.id);
  citizen.firstName = formData.firstName; 
  citizen.lastName = formData.lastName; 
  citizen.email = formData.email; 
  citizen.password = formData.password; 
  citizen.save(function (err) {
    if (err) return callback(err);
    log('Updated citizen [%s]', citizen.id);
    callback(null);
  });
}