/**
 * This JS is only a firs release while testing
 * dynamic build of components for nodejs with
 * express.
 *
 * This should in near future adopt the same
 * developing architecture as
 *
 * http://github.com/component/component.io
 *
 * and
 *
 * http://github.com/hunterloftis/component-test
 *
 * It.
 */

var page = require('page')
  , request = require('superagent')
  , dom = require('dom')
  , timeago = require('timeago');

/**
 * Expose Jade as global var
 * !! Ugly but needed until full
 * component based development
 * migration.
 *
 */

jade = require("jade");

/**
 * Homepage module.
 */

require('homepage');
require('proposal');

/**
 * Init `timeago` component with
 * locale as `es`
 */

timeago('.ago', { lang: 'es', interval: 10 });

/**
 * Render not found page.
 */

page('*', function(ctx, next) {
  console.log('Should render Not found.');
});

/**
 * Init page.js
 */

page();