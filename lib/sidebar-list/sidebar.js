/**
 * Module dependencies.
 */

var Sidebar = require('./view');
var request = require('superagent');
var t = require('t');
var log = require('debug')('sidebar-list');

/**
 * Create sidebar instance and expose
 */

var sidebar = module.exports = new Sidebar([], 'law');

/**
 * Load laws
 */

request.get('/api/law/all')
.set('Accept', 'application/json')
.end(function(err, res) {
  if (err || !res.ok) {
    sidebar.error(t('Unable to load laws. Please try reloading the page. Thanks!'));
    log('Load error: %s', err || res.error);
  };

  sidebar
  .set(res.body)
  .render();

  sidebar.emit('load');
});

sidebar.ready = function(fn) {
  function done() {
    if (sidebar.items.length) {
      return fn();
    }
  }

  if (sidebar.items.length) {
    setTimeout(done, 0);
  } else {
    this.once("load", done);
  }

  return this;
}