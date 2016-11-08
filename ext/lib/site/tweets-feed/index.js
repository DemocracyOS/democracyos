'use strict'

const express = require('express')
const Twitter = require('tweeter')
const config = require('ext/lib/config')

const app = module.exports = express()

let client

if (config.twitterConsumerKey) {
  client = new Twitter({
    consumer_key: config.twitterConsumerKey,
    consumer_secret: config.twitterConsumerSecret,
    access_token_key: config.twitterAccessKey,
    access_token_secret: config.twitterAccessSecret
  })
}

app.get('/tweets', function (req, res, next) {
  if (!client) {
    const err = new Error('Twitter account is not configured in this server.')
    err.code = 'TWITTER_NOT_CONFIGURED'
    err.status = 500
    return next(err)
  }

  client.get(
// -----------------------------------------
    'lists/statuses',
    {
      owner_screen_name: config.ownerScreenName,
      include_rts: false,
      slug: config.slug
    },
// -----------------------------------------
    // 'search/tweets',
    // {
    //   q: 'popular filter:media'
    // },
// -----------------------------------------
    function (err, tweets, response) {
      if (err) {
        return res.json({
          status: 500,
          error: err
        })
      }
      res.json({
        status: 200,
        results: {
          tweets: tweets
            .filter(tw => tw.entities.hasOwnProperty('media'))
            .filter((tw, i) => i < 6)
        }
      })
    }
  )
})
