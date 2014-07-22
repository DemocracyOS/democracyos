/**
 * Module dependencies.
 */

var domify = require('domify')
  , events = require('events')
  , empty = require('empty')
  , article = require('./article')
  , clause = require('./clause')
  , toArray = require('to-array')
  , truncate = require('truncate')
  , config = require('config')
  , Participants = require('participants-view')
  , t = require('t')
  , o = require('query')
  , classes = require('classes')
  , render = require('render')
  , SideComments = require('side-comments')
  , citizen = require('citizen');

/**
 * Expose ProposalArticle
 */
module.exports = ProposalArticle;

/**
 * Creates a new proposal-article view
 * from proposals object.
 *
 * @param {Object} proposal proposal's object data
 * @return {ProposalArticle} `ProposalArticle` instance.
 * @api public
 */

function ProposalArticle (proposal) {
  if (!(this instanceof ProposalArticle)) {
    return new ProposalArticle(proposal);
  };

  this.proposal = proposal;
  this.clauses = proposal.clauses.sort(function(a, b) {
      var sort = a.order - b.order;
      sort = sort > 0 ? 1 : -1;
      return sort;
    })

  var baseUrl = config.protocol + "://" + config.host + (config.publicPort ? (":" + config.publicPort) : "");
  this.el = render.dom(article, {
    proposal: proposal,
    clauses: this.clauses,
    baseUrl: baseUrl,
    truncate: truncate,
    config: config
  });

  this.events = events(this.el, this);

  this.participants = new Participants(proposal.participants || []);
  this.participants.render(o('.participants', this.el));
  this.participants.fetch();

  this.switchOn();

  citizen.ready(function () {
    var userComment = citizen ? { id: citizen.id, avatarUrl: citizen.gravatar, name: citizen.firstName} : null;
    var sideComments = new SideComments('.proposal.commentable-container', userComment, [
    {
      "sectionId": proposal.clauses[0].id,
      "comments": [
        {
          "id": 1,
          "authorAvatarUrl": "http://f.cl.ly/items/1W303Y360b260u3v1P0T/jon_snow_small.png",
          "authorName": "Jon Sno",
          "authorId": 2,
          "comment": "I'm Ned Stark's bastard. Related: I know nothing."
        },
        {
          "id": 2,
          "authorAvatarUrl": "http://f.cl.ly/items/2o1a3d2f051L0V0q1p19/donald_draper.png",
          "authorName": "Donald Draper",
          "authorId": 1,
          "comment": "I need a scotch."
        }
      ]
    }
    ], { locale: config['locale'], voting: true });
    sideComments.on('commentUpvoted', function (comment) {
      console.log(comment);
    });
  });
}

/**
 * Turn on event handlers on this view
 */

ProposalArticle.prototype.switchOn = function() {
  this.events.bind('click .clauses a.read-more', 'showclauses');
}

/**
 * Turn off event handlers on this view
 */

ProposalArticle.prototype.switchOff = function() {
  this.events.unbind();
}

ProposalArticle.prototype.showclauses = function(ev) {
  ev.preventDefault();

  var els = o.all('.clauses .clause.hide');
  els.forEach(function(el) {
    classes(el).remove('hide');
  });
  this.events.unbind('click .clauses a.read-more');
  o('.clauses a.read-more', this.el).remove();
}

/**
 * Render
 *
 * @return {NodeElement} a prosal's article
 * @api public
 */

ProposalArticle.prototype.render = function(el) {
  if (1 === arguments.length) {

    // if string, then query element
    if ('string' === typeof el) {
      el = document.querySelector(el);
    };

    // if it's not currently inserted
    // at `el`, then append to `el`
    if (el !== this.el.parentNode) {
      el.appendChild(this.el);
    };

    // !!!: Should we return different things
    // on different conditions?
    // Or should we be consistent with
    // render returning always `this.el`
    return this;
  };

  return this.el;
}

/**
 * Append view to article
 *
 * @param {Element} el
 * @return {Element} a prosal's article
 * @api public
 */

ProposalArticle.prototype.append = function(el) {
  this.el.appendChild(el);
  return this;
}