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
var Glossary = require('help-glossary');
var Markdown = require('help-markdown');
var qs = require('querystring');
var config = require('config');

page("/help/:page?", valid, parse, function(ctx, next) {
  if (!ctx.valid) return next();

  var page = ctx.params.page || "markdown";
  var container = render.dom(helpContainer);
  var content = o('.help-content', container);

  // prepare wrapper and container
  empty(o('#content')).appendChild(container);

  var faq = new FAQ;
  var tos = new TOS;
  var pp = new PP;
  var glossary = new Glossary(ctx.query.word);
  var markdown = new Markdown;

  // set active section on sidebar
  if (o('.active', container)) {
    classes(o('.active', container)).remove('active');
  };

  classes(o('[href="/help/' + page + '"]:parent', container)).add('active');

  // Set page's title
  title(o('[href="/help/' + page + '"]').textContent);

  // render all help pages
  if(config['faq']) faq.appendTo(content);
  if(config['tos']) tos.appendTo(content);
  if(config['pp']) pp.appendTo(content);
  if(config['glossary']) glossary.appendTo(content);
  markdown.appendTo(content);

  // Display current help page
  classes(o("#" + page + "-wrapper", container)).remove("hide");

  if (page == 'glossary') glossary.scroll();
});

function valid(ctx, next) {
  var p = ctx.params.page || "markdown";
  var valid = ['markdown'];
  if (config['faq']) valid.push('faq');
  if (config['tos']) valid.push('terms-of-service');
  if (config['pp']) valid.push('privacy-policy');
  if (config['glossary']) valid.push('glossary');
  return ctx.valid = ~valid.indexOf(p), next();
}

function parse(ctx, next) {
  ctx.query = qs.parse(ctx.querystring);
  next();
}