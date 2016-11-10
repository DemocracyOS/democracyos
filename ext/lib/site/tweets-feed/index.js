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
      owner_screen_name: config.ext.twitter.ownerScreenName,
      include_rts: false,
      slug: config.ext.twitter.slug
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
      console.log(tweets.length)
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
