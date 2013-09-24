/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , log = require('debug')('models:law');


/**
 * Law Vote Schema
 */

var Vote = new Schema({
    author: { type: ObjectId, ref: 'Citizen', required: true }
  , value: { type: String, enum: ["positive", "negative", "neutral"], required: true }
  , createdAt: { type: Date, default: Date.now }
});

/**
 * Law Schema
 */

var LawSchema = new Schema({
    state: { type: String, enum: ['bill', 'act', 'project'], default: 'bill', required: true }
  , lawId: { type: String, required: true }
  , clauses: [{
        clauseId: { type: String, required: true }
      , order: { type: Number, required: true }
      , text: { type: String, required: true }
    }]
  , votes: [Vote]
  , createdAt: { type: Date, default: Date.now }
  , updatedAt: { type: Date }
  , proxyVoteEnd: { type: Date }
  , voteEnd: { type: Date }
});

/**
 * Define Schema Indexes for MongoDB
 */

LawSchema.index({ lawId: 1 }, { unique: true, dropDups: true });

/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

LawSchema.set('toObject', { getters: true });
LawSchema.set('toJSON', { getters: true });

/**
 * -- Model's event hooks
 */

/**
 * Pre update modified time
 *
 * @api private
 */

LawSchema.pre('save', function(next) {
  this.updatedAt = this.isNew ? this.createdAt : Date.now();
  next();
});

/**
 * -- Model's API extension
 */

/**
 * Compile lawId to generate
 * a human readable title
 *
 * @return {String} clauses
 * @api public
 */

LawSchema.virtual('title').get(function() {
  var title = '';
  if ('bill' === this.state) title += 'Despacho';
  if ('act' === this.state) title += 'Ley';
  return title.concat(this.lawId);
});

/**
 * Compile clauses to render
 * text content
 *
 * @return {String} clauses
 * @api public
 */

LawSchema.virtual('content').get(function() {
  return this.clauses.sort(function(a, b) {
    var sort = a.order - b.order;
    sort = sort > 0 ? 1 : -1;
    return sort;
  }).map(function(c) {
    if (c.text) return "Article " + c.clauseId + ": " + c.text;
  }).join('\n');
});

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

LawSchema.virtual('abstentions').get(function() {
  return this.votes.filter(function(v) {
    return "neutral" === v.value;
  });
});

/**
 * Vote Law with provided citizen
 * and voting value
 *
 * @param {Citizen|ObjectId|String} citizen hex repr. of citizen's id
 * @param {String} value
 * @param {Function} cb
 * @api public
 */

LawSchema.methods.vote = function(citizen, value, cb) {
  var vote = { author: citizen, value: value };

  this.unvote(citizen);
  this.votes.push(vote);
  this.save(cb);
};

/**
 * Unvote Law from provided citizen
 *
 * @param {Citizen|ObjectId|String} citizen
 * @param {Function} cb
 * @api public
 */

LawSchema.methods.unvote = function(citizen, cb) {
  var votes = this.votes;
  var c = citizen.get ? citizen.get('_id') : citizen;

  var voted = votes.filter(function(v) {
    var a = v.author.get ? v.author.get('_id') : v.author;
    return a.equals
      ? a.equals(c)
      : a === c;
  });

  log('About to remove votes %j', voted);
  voted.length && voted.forEach(function(v) {
    var removed = votes.id(v.id).remove();
    log('Remove vote %j', removed);
  });

  if (cb) this.save(cb);
};

/**
 * Expose Mongoose model loaded
 */

module.exports = mongoose.model('Law', LawSchema);

