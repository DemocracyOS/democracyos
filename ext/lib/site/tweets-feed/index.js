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
      'collections/entries',
      {
        id: config.ext.twitter.timelineId
      },
      function (error, tweets, response) {
        if (error) return reject(error)
        const tweetsArray = tweets.objects.tweets
          ? Object.keys(tweets.objects.tweets)
            .map(tw => tweets.objects.tweets[tw])
            .filter(tw => tw.entities.hasOwnProperty('media'))
            .filter((tw, i) => i < 6)
          : []

        twCache = tweetsArray
        twExpires = Date.now() + 5 * 60 * 1000
        resolve(tweetsArray)
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
      res.json(200, {
        status: 200,
        results: {
          tweets: tweets
        }
      })
    })
    .catch(function (err) {
      console.log(err)
      return res.json(500, {
        status: 500,
        error: err
      })
    })
})
