/**
 * Module Dependencies
 */

 const debug = require('debug')
 const Notification = require('lib/models').Notification
 const api = require('lib/api-v2/db-api')
 const User = require('./user')
 const Topic = require('./topic')

 const log = debug('democracyos:db-api:notification')

/**
 * Get all notifications
 *
 * @param {User} user to get notifications from
 * @return {Module} `notification` module
 * @api public
 */

 exports.all = function all (user) {
   return new Promise(function (resolve, reject) {
     Notification
      .find({ user: user })
      .populate('user comment relatedUser topic')
      .exec()
      .then(function (notifications) {
        Notification
          .populate(notifications, { path: 'topic.forum', model: 'Forum' }, function (err, docs) {
            if (err) {
              return reject(err)
            }
            resolve(docs)
          })
      })
      .then(null, function (err) {
        reject(err)
      })
      .catch((err) => reject(err))
   })
 }

/**
 * Creates a new notification
 *
 * @param {Notification} data of the notification to be created
 * @return {Promise} a Promise of creating a new notification
 * @api public
 */

 exports.create = function create (data) {
   return map(data)
    .then(saveNotification)
    .catch((err) => Promise.reject(err))
 }

 function saveNotification (event) {
   if (!event) return Promise.resolve()

   log('Attempting to push new notification: %j', event)
   return new Promise((resolve, reject) => {
     var notification = new Notification(event)
     notification.save(function (err, doc) {
       if (err) {
         log('Error pushing notification: %s', err)
         return reject(err)
       }

       log('Notification pushed succesfully')
       return resolve(doc)
     })
   })
 }

 function map (eventData) {
   switch (eventData.event) {
     case 'comment-reply':
       return mappers.reply(eventData)
     case 'comment-upvote':
       return mappers.upvote(eventData)
     case 'comment-downvote':
       return mappers.downvote(eventData)
     default:
       return Promise.resolve()
   }
 }

 const mappers = {
   reply: function mapReply (eventData) {
     return new Promise((resolve, reject) => {
       getComment(eventData.comment.id)
        .then((comment) => getTopic(comment.reference))
        .then((topic) => resolve({
          type: 'reply',
          relatedUser: eventData.reply.author.id,
          user: eventData.comment.author.id,
          comment: eventData.comment.id,
          topic: topic.id
        }))
        .catch((err) => reject(err))
     })
   },

   upvote: function mapUpvote (eventData) {
     return new Promise((resolve, reject) => {
       getTopic(eventData.comment.reference)
        .then((topic) => resolve({
          type: 'upvote',
          user: eventData.comment.author._id,
          relatedUser: eventData.user._id,
          topic: topic.id,
          comment: eventData.comment.id
        }))
        .catch((err) => reject(err))
     })
   },

   downvote: function mapDownvote (eventData) {
     return new Promise((resolve, reject) => {
       getTopic(eventData.comment.reference)
        .then((topic) => resolve({
          type: 'downvote',
          user: eventData.comment.author._id,
          relatedUser: eventData.user._id,
          topic: topic.id,
          comment: eventData.comment.id
        }))
        .catch((err) => reject(err))
     })
   },

   topicVoted: function mapTopicVoted (eventData) {
     return new Promise((resolve, reject) => {
       Promise.all([
         getUser(eventData.user),
         getTopic(eventData.topic)
       ])
        .then((data) => resolve({
          type: 'topic',
          user: data[1].author.id,
          relatedUser: data[0].id,
          topic: data[1].id
        }))
        .catch((err) => reject(err))
     })
   }
 }

 function getUser (email) {
   return new Promise((resolve, reject) => {
     User.getByEmail(email, function (err, user) {
       if (err) {
         return reject(err)
       }

       return resolve(user)
     })
   })
 }

 function getComment (id) {
   return new Promise((resolve, reject) => {
     api.comments.find({ _id: id })
      .findOne()
      .exec((err, doc) => {
        if (err) {
          return reject(err)
        } else if (!doc) {
          return reject(new Error('comment not found'))
        }

        return resolve(doc)
      })
   })
 }

 function getTopic (id) {
   return new Promise((resolve, reject) => {
     Topic.searchOne(id, function (err, topic) {
       if (err) {
         return reject(err)
       }

       return resolve(topic)
     })
   })
 }
