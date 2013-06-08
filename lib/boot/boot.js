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

/**
 * Init `timeago` component with
 * locale as `es`
 */

timeago('.ago', { lang: 'es', interval: 10 });

/**
 * Vote proposal
 */

dom('.vote-box .vote-option').on('click', function (ev) {
  ev.preventDefault();
  var id = this.getAttribute('data-proposal')
    , value;

  if (dom(this).hasClass('vote-no')) {
    value = 'negative';
  } else if (dom(this).hasClass('vote-yes')) {
    value = 'positive';
  }

  request
  .post('/api/proposal/:id/vote'.replace(':id', id))
  .set('Accept', 'application/json')
  .send({value:value})
  .end(function (err, res) {
    if (err) {
      console.log(err);
      return;
    };

    if (res.body.error) {
      console.log(res.body.error);
      if (res.body.action && res.body.action.redirect) {
        return window.location.replace(res.body.action.redirect);
      };
    }
    // reload location.
    window.location.reload();
  });
});


/**
 * Show/Hide voting options
 */

dom('.vote-box .meta-data .change-vote').on('click', function (ev) {
  ev.preventDefault();
  dom('.vote-box .vote-options').toggleClass('hide', false);
  dom(this).toggleClass('hide', true);
  dom(this).off('click');
});

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