/**
* Module dependencies.
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var config = require('lib/config');

/*
 * Notification Schema
 */

var NotificationSchema = new Schema({
  user: { type: ObjectId, ref: 'User' },
  type: { type: String, enum: ['reply', 'upvote', 'downvote'], required: true },
  comment: { type: ObjectId, ref: 'Comment' },
  relatedUser: { type: ObjectId, ref: 'User' },
  topic: { type: ObjectId, ref: 'Topic' },
  createdAt: { type: Date, default: Date.now }
});

/**
 * Set translation key according to
 * notification type
 *
 * @return {String} text
 * @api public
 */

NotificationSchema.virtual('translationKey').get(function() {
  return 'notifications.:type.text'.replace(':type', this.type);
});

/**
 * Gets the URL associated to the notified object.
 * Needs `forum` property to be populated.
 *
 * @return {String} url
 * @api public
 */

NotificationSchema.virtual('url').get(function() {
  var url = '/:forumName/topic/:topicId';
  if (config.multiForum) {
    url = url.replace(':forumName', this.topic.forum.name);
  } else {
    url = url.replace('/:forumName', '');
  }
  url = url.replace(':topicId', this.topic.id.toString());
  return url;
});

/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

NotificationSchema.set('toObject', { getters: true });
NotificationSchema.set('toJSON', { getters: true });

module.exports = function initialize(conn) {
  return conn.model('Notification', NotificationSchema);
};
