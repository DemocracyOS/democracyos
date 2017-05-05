const path = require('path')
const express = require('express')
const layout = require('lib/site/layout')

const app = module.exports = express()

layout.setTemplate(path.join(__dirname, 'index.jade'))

app.use(function initializeState (req, res, next) {
  if (!res.locals.initialState) res.locals.initialState = {}

  next()
})
