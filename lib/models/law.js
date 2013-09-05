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
 * Expose Mongoose model loaded
 */

module.exports = mongoose.model('Law', LawSchema);