/**
 * Module dependencies.
 */

import bus from 'bus';
import config from '../config/config.js';
import page from 'page';
import request from '../request/request.js';

page('/logout', (ctx, next) => {
  bus.emit('logout');
  setTimeout(redirect, 100);

  function redirect () {
    if (config.signinUrl) return window.location = config.signinUrl;
    page('/signin');
  }
});