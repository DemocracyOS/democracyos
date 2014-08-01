/**
 * Module dependencies.
 */

var o = require('dom');
var log = require('debug')('democracyos:autovalidate');
var serialize = require('serialize');
var validate = require('validate');

var exports = module.exports = autovalidate;

function autovalidate(el, fn) {
  var form = o(el);
  var options = {};
  form.find('input, textarea, select').each(function(node) {
    var vals = exports.validators(o(node));
    if (!vals) return;
    options[vals.name] = vals.validations;
  });
  validate(options, function(ok) {
    if (!ok)
      return log("validation failed");
    var obj = serialize.object(form[0]);
    log('fn(%j)', obj);
    fn(obj);
  })
}

exports.validators = function(field) {
  var validations = field.attr('validate');
  if (!validations) return;
  var obj = {};
  var name = field.attr('name');
  validations = validations.split(' ').reduce(values, {});
  log('validators for `%s`', name, validations);
  return {name: name,validations: validations};
};

function values(obj, name) {
  var parts = name.split(':');
  obj[parts[0]] = null == parts[1] ? true : parts[1];
  return obj;
}