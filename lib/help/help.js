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

page("/help/:page?", function(ctx, next) {
  var page = ctx.params.page || "faq";
  var container = render.dom(helpContainer);
  var content = o('.help-content', container);

  // prepare wrapper and container
  empty(o('#content')).appendChild(container);

  // var faq = new FAQ;
  // var termsOfService = new TermsOfService;
  // var privacyPolicy = new PrivacyPolicy;

  // set active section on sidebar
  if (o('.active', container)) {
    classes(o('.active', container)).remove('active');
  };

  classes(o('[href="/help/' + page + '"]:parent', container)).add('active');

  // Set page's title
  title(o('[href="/help/' + page + '"]').textContent);

  // render all help pages
  // faq.render(content);
  // termsOfService.render(content);
  // privacyPolicy.render(content);

  // Display current help page
  // classes(o("#" + page + "-wrapper", container)).remove("hide");
});