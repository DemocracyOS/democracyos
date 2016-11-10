'use strict'

const express = require('express')
const Twitter = require('twitter')
const config = require('ext/lib/config')

const app = module.exports = express()

let client

if (config.ext.twitter.consumerKey) {
  client = new Twitter({
    consumer_key: config.ext.twitter.consumerKey,
    consumer_secret: config.ext.twitter.consumerSecret,
    access_token_key: config.ext.twitter.accessKey,
    access_token_secret: config.ext.twitter.accessSecret
  })
}

let twCache = []
let twExpires = Date.now()

function twGet () {
  return (twExpires > Date.now())
    ? Promise.resolve(twCache)
    : twFetch()
}

function twFetch () {
  return new Promise((resolve, reject) => {
    client.get(
      'lists/statuses',
      {
        owner_screen_name: config.ext.twitter.ownerScreenName,
        include_rts: false,
        slug: config.ext.twitter.slug
      },
      function (error, tweets, response) {
        if (error) reject(error)
        let tweetsValid = tweets
          .filter(tw => tw.entities.hasOwnProperty('media'))
          .filter((tw, i) => i < 6)

        twCache = tweetsValid
        twExpires = Date.now() + 5 * 60 * 1000
        resolve(tweetsValid)
      }
    )
  })
}

app.get('/tweets', function (req, res, next) {
  if (!client) {
    const err = new Error('Twitter account is not configured in this server.')
    err.code = 'TWITTER_NOT_CONFIGURED'
    err.status = 500
    return next(err)
  }

  twGet()
    .then(function (tweets) {
      res.json({
        status: 200,
        results: {
          tweets: tweets
        }
      })
    })
    .catch(function (err) {
      return res.json({
        status: 500,
        error: err
      })
    })
})
