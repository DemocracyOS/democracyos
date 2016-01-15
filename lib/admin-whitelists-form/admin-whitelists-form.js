/**
 * Module dependencies.
 */

var FormView = require('./form-view')
var log = require('debug')('democracyos:admin-whitelists-form')
var page = require('page')
var request = require('../request/request.js')

page('/admin/users/create', function (ctx, next) {
  var form = new FormView()
  form.replace('.admin-content')
})

page('/admin/users/:id', load, function (ctx, next) {
  var form = new FormView(ctx.whitelist)
  form.replace('.admin-content')
})

/**
 * Load specific whitelist from context params
 */

function load (ctx, next) {
  request
    .get('/api/whitelists/' + ctx.params.id)
    .end(function (err, res) {
      if (err || !res.ok) {
        var message = 'Unable to load whitelists for ' + ctx.params.id
        return log(message)
      }

      ctx.whitelist = res.body
      return next()
    })
}
