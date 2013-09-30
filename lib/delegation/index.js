/**
 * Module dependencies.
 */

var express = require('express')
  , restrict = require('lib/utils').restrict
  , required = require('lib/utils').required
  , api = require('lib/db-api')
  , log = require('debug')('delegation');

var app = module.exports = express();

app.post('/delegation/create', restrict, required('tag tid'), loadDelegation, createOrUpdateDelegation, function(req, res) {
  res.json(req.delegation);
});

app.post('/delegation/remove', restrict, required('tag'), loadDelegation, removeDelegation, function(req, res) {
    res.send(200, 'OK');
});

function loadDelegation(req, res, next) {

  var tag = req.param('tag');

  api.delegation.getByTrusterAndTag(req.user.id, req.tag, function(err, delegation) {
  	if (err) return _handleError(err, req, res);

  	log('Found delegation %j', delegation);
  	req.delegation = delegation;
  });
  next();
};

function _handleError (err, req, res) {
  res.format({
    html: function() {
      // this should be handled better!
      // maybe with flash or even an 
      // error page.
      log('Error found with html request %j', err);
      res.redirect('back');
    },
    json: function() {
      log("Error found: %j", err);
      res.json({ error: err });
    }
  })
};

function createOrUpdateDelegation(req, res, next) {
  var tag = req.param('tag');
  var trusteeId = req.param('tid');

  if (req.delegation) {
    // update existing delegation
    api.delegation.updateTrustee(req.delegation, trusteeId, function(err, updatedDelegation) {
      if (err) return _handleError(err, req, res);
      req.delegation = updatedDelegation;
      next();
    })
  } else {
    // create new delegation
    api.delegation.create(req.user.id, tag, trusteeId, function(err, newDelegation) {
      if (err) return _handleError(err, req, res);
      req.delegation = newDelegation;
      next();
    });
  }
};

function removeDelegation(req, res, next) {
  api.delegation.remove(req.delegation, function(err) {
    if (err) return _handleError(err, req, res);
    next();
  });
};