/**
 * Module dependencies.
 */

var express = require('express')
var api = require('lib/db-api')
var utils = require('lib/utils')
var restrict = utils.restrict
var staff = utils.staff
var log = require('debug')('democracyos:stats')

var app = module.exports = express()

/**
 * Limit request to json format only
 */

app.get('/', restrict, staff, function (req, res) {
  log('Request /stats')
  var query = { publishedAt: { $exists: true } }

  api.topic.search(query, function (err, topics) {
    if (err) return _handleError(err, req, res)

    log('Found %d published topics', topics.length)

    var publishedTopics = topics.length

    api.user.all(function (err, users) {
      if (err) return _handleError(err, req, res)

      log('Found %d registered users', users.length)

      var registeredUsers = users.length

      api.user.findEmailValidated(function (err, users) {
        if (err) return _handleError(err, req, res)

        log('Found %d email validated users', users.length)

        var emailValidatedUsers = users.length

        api.topic.votes(function (err, votes) {
          if (err) return _handleError(err, req, res)

          log('Found %d votes', votes)

          api.comment.all(function (err, comments) {
            if (err) return _handleError(err, req, res)

            log('Found %d comments', comments.length)

            api.comment.ratings(function (err, rated) {
              if (err) return _handleError(err, req, res)

              log('Found %d comments', rated)

              api.comment.totalReplies(function (err, replies) {
                if (err) return _handleError(err, req, res)

                log('Found %d comment replies', replies)

                res.json({
                  topics: publishedTopics,
                  users: registeredUsers,
                  emailValidatedUsers: emailValidatedUsers,
                  votes: votes,
                  comments: comments.length,
                  rated: rated,
                  replies: replies
                })
              })
            })
          })
        })
      })
    })
  })
})
