/**
 * Module Dependencies
 */

var mongoose = require('mongoose');
var Notification = mongoose.model('Notification');
var User = require('./user');
var Topic = require('./topic');
var log = require('debug')('democracyos:db-api:notification');
var utils = require('lib/utils');
var pluck = utils.pluck;

/**
 * Get all notifications
 *
 * @param {User} user to get notifications from
 * @return {Module} `notification` module
 * @api public
 */

exports.all = function all(user) {
  return new Promise(function(resolve, reject) {
    Notification
      .find({ user: user })
      .populate('user comment relatedUser topic')
      .exec()
      .then(function (notifications) {
        resolve(notifications);
      })
      .then(null, function (err) {
        reject(err);
      })
  });
}

/**
 * Creates a new notification
 *
 * @param {Notification} data of the notification to be created
 * @return {Promise} a Promise of creating a new notification
 * @api public
 */

exports.create = function create(data) {
    return map(data)
    .then(saveNotification)
    .catch(err => Promise.reject(err));
}

function saveNotification (event) {
  return new Promise((resolve, reject) => {
    var notification = new Notification(event);
    notification.save(function (err, doc) {
      if (err) {
        return reject(err);
      }

      return resolve(doc);
    });
  });
}

function map (eventData) {
  switch (eventData.event) {
    case 'comment-reply':
      return mappers.reply(eventData);
    case 'comment-upvote':
      return mappers.upvote(eventData);
    case 'comment-downvote':
      return mappers.downvote(eventData);
    default:
      return Promise.resolve();
  }
}

const mappers = {
  reply: function mapReply (eventData) {
    return new Promise((resolve, reject) => {
      getUser(eventData.to)
      .then(user => resolve({
        type: 'reply',
        relatedUser: eventData.reply.author.id,
        user: user,
        comment: eventData.reply.id
      }))
      .catch(err => reject(err));
    });
  },

  upvote: function mapUpvote (eventData) {
    return new Promise((resolve, reject) => {
      getTopic(eventData.comment.reference)
      .then(topic => resolve({
        type: 'upvote',
        user: topic.author.id,
        relatedUser: eventData.user.id,
        topic: topic.id,
        comment: eventData.comment.id
      }))
      .catch(err => reject(err));
    });
  },

  downvote: function mapDownvote (eventData) {
    return new Promise((resolve, reject) => {
      getTopic(eventData.comment.reference)
      .then(topic => resolve({
        type: 'downvote',
        user: topic.author.id,
        relatedUser: eventData.user.id,
        topic: topic.id,
        comment: eventData.comment.id
      }))
      .catch(err => reject(err));
    });
  },

  topicVoted: function mapTopicVoted (eventData) {
    return new Promise((resolve, reject) => {
      Promise.all([
        getUser(eventData.user),
        getTopic(eventData.topic)
      ])
      .then(data => resolve({
        type: 'topic',
        user: data.topic.author.id,
        relatedUser: data.user.id,
        topic: data.topic.id
      }))
      .catch(err => reject(err));
    });
  }
}

function getUser (email) {
  return new Promise ((resolve, reject) => {
    User.getByEmail(email, function (err, user) {
      if (err) {
        return reject(err);
      }

      return resolve(user);
    })
  });
}

function getTopic (id) {
  return new Promise((resolve, reject) => {
    Topic.searchOne(eventData.topic.id, function (err, topic) {
      if (err) {
        return reject(err);
      }

      return resolve(topic);
    });
  });
}
