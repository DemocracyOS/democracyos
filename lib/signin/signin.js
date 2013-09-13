/**
 * Module dependencies.
 */

var page = require('page');
var View = require('./view');
var empty = require('empty');
var request = require('superagent');

page('/signin', function(ctx, next) {
  // Retrieve container
  var container = document.querySelector('section.app-content');

  // Build signin view with options
  var form = new View({});

  empty(container).appendChild(form.render());

  form.on('submit', function(data) {
    request
    .post('/signin')
    .send(data)
    .end(function(err, res) {
      if (!res.ok) {
        return form.errors([res.error]);
      };
      if (err || (res.body && res.body.error)) {
        return form.errors([err || res.body.error]);
      };
      window.location.replace('/');
    });
  });

});
