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
  , createdAt: { type: Date, default: Date.now }
  , updatedAt: { type: Date }
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

LawSchema.pre('save').get(function(next) {
  this.updatedAt = this.isNew ? this.createdAt : new Date;
  next();
});

/**
 * Expose Mongoose model loaded
 */

module.exports = mongoose.model('Law', LawSchema);

