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

timeago('.ago', {lang: 'es'});

