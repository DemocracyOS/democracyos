/**
 * Extend module's NODE_PATH
 * HACK: temporary solution
 */

require('node-path')(module);

/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var DelegationSchema = new Schema({
    truster: { type: ObjectId, ref:'Citizen', required: true }
  , tag: { type: ObjectId, ref: 'Tag', required: true }
  , trustee: { type: ObjectId, ref: 'Citizen', required: true }
  , updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Delegation', DelegationSchema);

/**
 * Define Schema Indexes for MongoDB
 */

DelegationSchema.index({ truster: 1 });
DelegationSchema.index({ trustee: 1 });
DelegationSchema.index({ truster: 1, tag: 1}, {unique: true, dropDups: true});

/**
 * Find all `Delegation`s by a truster with the given ID
 * 
 * @param {String|ObjectId} trusterId id of the delegations truster
 * @param {Function} cb mongoose result callback
 * @return {Error} err
 * @return {Array} array of resulting delegations
 * @api public
 */

DelegationSchema.statics.allByTruster = function(trusterId, cb) {
  return this.find({ truster: trusterId }).exec(cb);
}

/**
 * Find all `Delegation`s for a trustee with the given ID
 * 
 * @param {String|ObjectId} trusteeId id of the delegations trustee
 * @param {Function} cb mongoose result callback
 * @return {Error} err
 * @return {Array} array of resulting delegations
 * @api public
 */

DelegationSchema.statics.allForTrustee = function(trusteeId, cb) {
  return this.find({ trustee: trusteeId }).exec(cb);
}

/**
 * Find a single `Delegation` by a trustee for a given `Tag`
 * 
 * @param {ObjectId} trusteeId id of the delegation's trustee
 * @param {Function} cb mongoose result callback
 * @return {Error} err
 * @return {Delegation} the `Delegation`
 * @api public
 */

DelegationSchema.statics.getByTrusterAndTag = function(trusteeId, tag, cb) {
  return this.findOne({ truster: trusterId, tag: tag }).exec(cb);
}