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
 * Init `timeago` component with
 * locale as `es`
 */

timeago('.ago', {lang: 'es'});

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
})