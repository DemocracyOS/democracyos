/**
 * Module dependencies.
 */

var config = require('lib/config')
var express = require('express')
var app = module.exports = express()
var visibility = require('lib/visibility')

app.get('/help', visibility, require('lib/site/layout'))
app.get('/help/markdown', visibility, require('lib/site/layout'))
if (config.termsOfService) {
  app.get('/help/terms-of-service', visibility, require('lib/site/layout'))
}
if (config.privacyPolicy) {
  app.get('/help/privacy-policy', visibility, require('lib/site/layout'))
}
if (config.frequentlyAskedQuestions) {
  app.get('/help/faq', visibility, require('lib/site/layout'))
}
if (config.glossary) {
  app.get('/help/glossary', visibility, require('lib/site/layout'))
}
