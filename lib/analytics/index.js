/**
 * Module Dependencies
 */

import bus from 'bus';
import page from 'page';
import user from '../user/user.js'

/**
 * Track every page change
 */

page('*', (ctx, next) => {
  analytics.page(ctx.path);
  next();
});

/**
 * Track global user events
 */

bus.on('logout', () => {
  analytics.track('logout');
  analytics.reset();
});

user.on('loaded', () => {
  const { email, firstName, lastName } = user;
  analytics.identify(user.id, {
    email,
    firstName,
    lastName
  });
})
