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

DelegationSchema.index({ truster:1, trustee:1 });

/**
 * Find `Delegation` by its truster's ID
 * 
 * @param {ObjectId} trusterId id of the delegation's truster
 * @param {Function} cb mongoose result callback
 * @return {Error} err
 * @return {Delegation} delegation
 * @api public
 */

DelegationSchema.statics.findByTruster = function(trusterId, cb) {
  return this.find({ truster: trusterId }).exec(fn);
}