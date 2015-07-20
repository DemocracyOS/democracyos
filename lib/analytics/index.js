/**
 * Module Dependencies
 */

import bus from 'bus';
import config from '../config/config';
import page from 'page';
import user from '../user/user.js'

const enabled = !!config.segmentKey;
const analytics = window.analytics || {};

/**
 * Track every page change
 */

page('*', (ctx, next) => {
  if (enabled) analytics.page(ctx.path);
  next();
});

/**
 * Track global user events
 */

bus.on('logout', () => {
  if (!enabled) return;
  analytics.track('logout');
  analytics.reset();
});

user.on('loaded', () => {
  if (!enabled) return;
  const { email, firstName, lastName } = user;
  analytics.identify(user.id, {
    email,
    firstName,
    lastName
  });
})

export default analytics;
export { enabled };