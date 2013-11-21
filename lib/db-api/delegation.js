/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Delegation = mongoose.model('Delegation')
  , log = require('debug')('democracyos:db-api:delegation');


 /**
 * Get all `Delegation`s by `Citizen` with given ID
 *
 * @param {String|ObjectId} trusterId id of the `Citizen` that trusted his vote to another.
 * @param {Function} fn callback function
 *   - 'err' error found while accessing data or `null`
 *   - 'delegations' list items found or `undefined`
 * @return {Module} `delegation` module
 * @api public
 */
exports.allByTruster = function allByTruster(trusterId, fn) {
  log('Looking for all delegations for truster %j.', trusterId);

  Delegation
  .allByTruster(trusterId, function (err, delegations) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering delegations for truster %s: %j', trusterId, delegations);
    fn(null, delegations);
  });

  return this;
};

/**
 * Get all `Delegation`s to `Citizen` with given ID
 *
 * @param {String|ObjectId} trusteeId id of the `Citizen` that trusted his vote to another.
 * @param {Function} fn callback function
 *   - 'err' error found while accessing data or `null`
 *   - 'delegations' list items found or `undefined`
 * @return {Module} `delegation` module
 * @api public
 */
exports.allForTruster = function allForTrustee(trusteeId, fn) {
  log('Looking for all delegations for trustee %j.', trusteeId);

  Delegation
  .allForTrustee(trusteeId, function (err, delegations) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering delegations for trustee %s: %j', trusteeId, delegations);
    fn(null, delegations);
  });

  return this;
};

/**
 * Get a single `Delegation` by `Citizen` with given ID on `Tag` with given ID
 *
 * @param {String|ObjectId} trusterId id of the `Citizen` that trusted his vote to another.
 * @param {String|ObjectId} tagId id of the `Tag` that acts as delegation proxy.
 * @param {Function} fn callback function
 *   - 'err' error found while accessing data or `null`
 *   - 'delegation' the single delegation, if it exists
 * @return {Module} `delegation` module
 * @api public
 */
exports.getByTrusterAndTag = function getByTrusterAndTag(trusterId, tagId, fn) {
  log('Looking for delegation for truster %j on tag %j.', trusterId, tag);

  Delegation
  .getByTrusterAndTag(trusterId, function (err, delegation) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering delegation fortruster %s on tag %j: %j', trusterId, tagId, delegation);
    fn(null, delegations);
  });

  return this;
};

/**
 * Create a new `Delegation` or replace an existing one between the parameter
 * truster and trustee, over the parameter tag.
 * 
 * @param  {String|ObjectId} trusterId id of the `Citizen` that delegates his vote.
 * @param  {String|ObjectId} tag       id of the `Tag` over which truster is delegating.
 * @param  {String|ObjectId} trusteeId id of the `Citizen` that receives the truster's vote.
 * @param {Function} fn callback function
 * @return {Module} `delegation`module
 * @api public
 */
exports.create = function create(trusterId, tag, trusteeId, fn) {
  log('Creating delegation from %j to %j over tag %j', trusterId, trusteeId, tag);

  //TODO: fetch tag

  //instantiate and persist new delegation
  var delegation = new Delegation({
  	truster: req.user.id,
  	tag: tag,
  	trustee: trusteeId
  });

  delegation.save(function(err) {
    if (err) {
      log('Error while saving delegation from %j to %j over tag %j - error:', trusterId, trusteeId, tag, err);
      return fn(err);
    }
  });

  fn(null, delegation);

  return this;
};

/**
 * Updates the trustee for an existing `Delegation`. I.e.: "Redirects"
 * the delegation from one trustee to another
 * @param  {Delegation}   delegation   the `Delegation` to be updated.
 * @param  {String|OcjectId}   newTrusteeId id of the new `Citizen` to be the updated `Delegation`'s trustee.
 * @param  {Function} fn           callback function.
 * @return {Module}                `delegation` module.
 */
exports.updateTrustee = function updateTrustee(delegation, newTrusteeId, fn) {
  log('Updateing trustee for delegation %j with %j', delegation, trustee);
  delegation.trustee = newTrusteeId;

  delegation.save(function(err) {
    if (err) {
      log('Error while updating delegation [%j] with trustee %j - error:', delegation._id, newTrusteeId, tag, err);
      return fn(err);
    }
  });

  log('Delivering delegation with updated trustee: %j', delegation);
  fn(null, delegation);

  return this;
};

/**
 * Removes a `Delegation` from storage
 * @param  {Delegation}   delegation the `Delegation` to be removed.
 * @param  {Function} fn         callback function.
 * @return {Module}              `delegation` module.
 */
exports.remove = function remove(delegation, fn) {
  log('Removing delegation %j with %j', delegation);

  delegation.remove(function (err) {
    if (err) {
      log('Error while removing delegation %j - error:', delegation, err);
      return fn(err);
    }
  });

  log('Delegation %j removed', delegation);
  fn(null, delegation);

  return this;
};