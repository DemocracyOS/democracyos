import title from '../title/title.js';
import page from 'page';
import o from 'component-dom';
import user from '../user/user.js';
import { dom } from '../render/render.js';
import Password from '../settings-password/view.js';
import Profile from '../settings-profile/view.js';
import Notifications from '../settings-notifications/view.js';
import Forums from '../settings-forum/view.js';
import settings from './settings-container.jade';
import config from '../config/config.js';

/**
 * Check if page is valid
 */

let valid = (ctx, next) => {
  var page = ctx.params.page || "profile";
  var valid = ['profile', 'password', 'notifications'];
  if (config.multiForum) valid.push('forums');
  return ctx.valid = ~valid.indexOf(page), next();
};

/**
 * Check if exists external settings
 */

let external = (ctx, next) => {
  if (!config.settingsUrl) return next();
  window.location = config.settingsUrl + (ctx.params.page ? ('/' + ctx.params.page) : '');
};

page('/settings/:page?', valid, external, user.required, (ctx, next) => {
  if (!ctx.valid) {
    return next();
  }

  let page = ctx.params.page || "profile";
  let container = o(dom(settings));
  let content = o('.settings-content', container);

  let profile = new Profile;
  let password = new Password;
  let notifications = new Notifications;

  // prepare wrapper and container
  o('#content').empty().append(container);

  // set active section on sidebar
  if (o('.active', container)) {
    o('.active', container).removeClass('active');
  }

  o('[href="/settings/' + page + '"]', container).addClass('active');

  // Set page's title
  title(o('[href="/settings/' + page + '"]').html());

  // render all settings pages
  profile.appendTo(content);
  if (!(config.facebookSignin || config.googleSignin)) {
    password.appendTo(content);
  }
  notifications.appendTo(content);

  if (config.multiForum) {
    let forums = new Forums;
    forums.appendTo(content);
  }

  // Display current settings page
  o("#" + page + "-wrapper", container).removeClass('hide');
});
