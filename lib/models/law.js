/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

/**
 * Law Schema
 */

var LawSchema = new Schema({
    state: { type: String, enum: ['bill', 'act'], default: 'bill', required: true }
  , lawId: { type: String, required: true }
  , clauses: [{
        clauseId: { type: String, required: true }
      , order: { type: Number, required: true }
      , text: { type: String, required: true }
    }]
  , votes: [Vote]
  , createdAt: { type: Date, default: Date.now }
  , updatedAt: { type: Date }
});

var Vote = new Schema({
  author: { type: ObjectId, ref: 'Citizen', required: true },
  value: { type: String, enum: ["positive", "negative", "neutral"], required: true },
  createdAt: { type: Date, default: Date.now }
});

/**
 * Define Schema Indexes for MongoDB
 */

LawSchema.index({ lawId: 1 }, { unique: true, dropDups: true });

/**
 * -- Model's event hooks
 */

/**
 * Pre update modified time
 *
 * @api private
 */

// LawSchema.pre('save').get(function(next) {
//   console.log(this);
//   this.updatedAt = this.isNew ? this.createdAt : new Date;
//   next("asdasd");
// });

/**
 * -- Model's API extension
 */

/**
 * Get `positive` vots
 *
 * @return {Array} voters
 * @api public
 */

LawSchema.virtual('upvotes').get(function() {
  return this.votes.filter(function(v) {
    return "positive" === v.value;
  });
});

/**
 * Get `negative` votes
 *
 * @return {Array} voters
 * @api public
 */

LawSchema.virtual('downvotes').get(function() {
  return this.votes.filter(function(v) {
    return "negative" === v.value;
  });
});

/**
 * Get `neutral` votes
 *
 * @return {Array} voters
 * @api public
 */

LawSchema.virtual('whitevotes').get(function() {
  return this.votes.filter(function(v) {
    return "neutral" === v.value;
  });
});

/**
 * Expose Mongoose model loaded
 */

module.exports = mongoose.model('Law', LawSchema);

