/**
 * Module dependencies.
 */

var classes = require('classes');
var empty = require('empty');
var helpContainer = require('./help-container');
var page = require('page');
var o = require('query');
var render = require('render');
var title = require('title');
var FAQ = require('help-faq');
var PP = require('help-pp');
var TOS = require('help-tos');
var Markdown = require('help-markdown');

page("/help/:page?", function(ctx, next) {
  var page = ctx.params.page || "faq";
  var container = render.dom(helpContainer);
  var content = o('.help-content', container);

  // prepare wrapper and container
  empty(o('#content')).appendChild(container);

  var faq = new FAQ;
  var tos = new TOS;
  var pp = new PP;
  var markdown = new Markdown;

  // set active section on sidebar
  if (o('.active', container)) {
    classes(o('.active', container)).remove('active');
  };

  classes(o('[href="/help/' + page + '"]:parent', container)).add('active');

  // Set page's title
  title(o('[href="/help/' + page + '"]').textContent);

  // render all help pages
  faq.render(content);
  tos.render(content);
  pp.render(content);
  markdown.render(content);

  // Display current help page
  classes(o("#" + page + "-wrapper", container)).remove("hide");
});