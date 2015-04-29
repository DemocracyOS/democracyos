/**
 * Module dependencies.
 */

import bus from 'bus'
import config from 'config'
import page from 'page'
import request from 'request'
import debug from 'debug'
import citizen from 'citizen'

let debug = log('democracyos:logout');

page('/logout', (ctx, next) => {
  bus.emit('logout');

  setTimeout(redirect, 0);

  function redirect () {
    if (config.signinUrl) return window.location = config.signinUrl;
    page('/signin');
  }
});
