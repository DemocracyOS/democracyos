/**
 * Module dependencies.
 */

var request = require('superagent')
  // , comments = require('comments');

/**
 * Expose `ProposalView`
 */

module.exports = ProposalView;

/**
 * Initialize a `ProposalView` with
 * the `proposal` id.
 *
 * @param {String} proposal id to query
 * @api public
 */

function ProposalView (proposal) {
  if (!(this instanceof ProposalView)) {
    return new ProposalView(proposal);
  };

  this.proposal = proposal;
  this.el = document.createElement('div');
}

/**
 * Get `proposal` object from `id` and
 * invoke `fn(null, obj)`.
 *
 * @param {String} id proposal's id
 * @param {Function} fn callback function
 * @api private
 */

ProposalView.prototype.get = function(id, fn) {
  var url = '/api/proposal/:id'.replace(':id', id)

  request
  .get(url)
  .set('Accept', 'application/json')
  .end(function(res) {
    if (res.error) {
      return fn(res.error);
    };

    fn(null, res.body);
  });
}