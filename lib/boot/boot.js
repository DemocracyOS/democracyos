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
 * Inicia timeago en castellano
 */

timeago('.ago', {lang: 'es'});

/**
 * Votar propuesta
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
  .send({value:value})
  .end(function (err, res) {
    if (err) {
      console.log(err);
      return;
    };

    // reload location.
    window.location.reload();
  });
});