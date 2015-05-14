/**
 * Module dependencies.
 */

var express = require('express');
var config = require('lib/config');
var api = require('lib/db-api');
var utils = require('lib/utils');
var restrict = utils.restrict;
var maintenance = utils.maintenance;
//var Manager = require('machinepack-democracyosmanager');
var log = require('debug')('democracyos:democracy');

/**
 * Exports Application
 */

var app = module.exports = express();

/**
 * Define routes for Dashboard module
 */

app.get('/', function(req, res) {
  api.democracy.all(function(err, democracies) {
    if (err) return _handleError(err, req, res);
    return res.status(200).json(democracies);
  });
});

app.get('/mine', restrict, function(req, res) {
  api.democracy.findOneByOwner(req.user.id, function(err, democracy) {
    if (err) return _handleError(err, req, res);

    return res.status(200).json(democracy);
  });
});

app.post('/', restrict, maintenance, function(req, res) {
  var data = {
    // url: config.manager.url,
    // access_token: config.manager.token,
    name: req.body.name,
    title: req.body.title,
    owner: req.user._id.toString(),
    summary: req.body.summary,
  };

  log('Trying to create democracy: %o', data);

  res.status(200).json(data);

  // Manager.createDeployment(data).exec({
  //   error: function(err){
  //     log('Error found: %j', err);
  //     _handleError('Sorry, there was an unexpected error. Try again later please.', req, res);
  //   },

  //   serverError: function(err){
  //     log('Error found: %j', err);
  //     _handleError('Sorry, there was an error. Try again later please.', req, res);
  //   },

  //   badRequest: function(err){
  //     var e = err.err.msg ? err.err.msg : err.err.message
  //     _handleError(e || 'badRequest', req, res);
  //   },

  //   success: function(deployment){
  //     res.status(200).json(deployment);
  //   }
  // });
});

app.delete('/:id', restrict, maintenance, function(req, res) {

  api.democracy.findById(req.params.id, function(err, democracy) {
    if (err) return _handleError(err, req, res);
    if (!democracy) return _handleError('The user doesnt have any democracy.', req, res);

    log('Trying to delete democracy: %o', democracy);

    // Manager.deleteDeployment({
    //   url: config.manager.url,
    //   access_token: config.manager.token,
    //   name: deployment.name
    // }).exec({
    //   error: function(err){
    //     log('Error found: %j', err);
    //     _handleError('Sorry, there was an unexpected error. Try again later please.', req, res);
    //   },

    //   serverError: function(err){
    //     log('Error found: %j', err);
    //     _handleError('Sorry, there was an error. Try again later please.', req, res);
    //   },

    //   badRequest: function(err){
    //     var e = err.err.msg ? err.err.msg : err.err.message
    //     _handleError(e || 'badRequest', req, res);
    //   },

    //   success: function(){
    //     res.sendStatus(200);
    //   }
    // });
  })
});

app.get('/exists', function(req, res, next) {
  api.democracy.exists(req.query.name, function(err, exists) {
    if (err) return next(err);
    return res.status(200).json({ exists: exists });
  });
});


/**
 * Helper functions
 */

function _handleError (err, req, res) {
  log('Error found: %s', err);
  var error = err;
  if (err.errors && err.errors.text) error = err.errors.text;
  if (error.type) error = error.type;

  res.status(400).json({ error: error });
}
