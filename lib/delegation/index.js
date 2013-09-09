/**
 * Module dependencies.
 */

var express = require('express')
  , restrict = require('lib/utils').restrict
  , api = require('lib/db-api')
  , log = require('debug')('delegation');

var app = module.exports = express();

app.post('/delegations/create', restrict, loadDelegation, createDelegation, function(req, res) {
  res.send(req.delegation ? req.delegation.id : '');
});

app.post('/delegations/delete', restrict, loadDelegation, deleteDelegation, function(req, res) {
    res.send(req.delegation ? req.delegation.id : '');
});

var loadDelegationScope = function(req, res, next) {
  if(req.param('category')) req.scope = 'category';
  if(req.param('issue')) req.scope = 'issue';
  if(!req.scope) return res.json({error: "no category or issue reference received for delegation scope"});
  next();
};

var loadDelegation = function(req, res, next) {

  api.delegation.get(req.user.id, req.scope, function(err, delegation) {
  	if (err) return _handleError(err, req, res);

  	log('Serving delegation %j', delegation);
  	res.json(delegation)
  });
  next();
}

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
}

var createDelegation = function(req, res, next) {
  var tag = req.param('category');
  var trusteeId = req.param('tid');
  
  //Prevent delegation for no trustee
  if (!trusteeId) {
    log('Unable to create a delegation from user %s; trustee cannot be undefined', req.user.id);
    return next();
  }
  // Prevent self-delegation
  if (req.user.id == trusteeId) return next();

  if (!tag) {
    log('Impossible to create a delegation from user %s to trustee %s; tag was undefined', req.user.id, trusteeId);
  }

  // create new delegation
  api.delegation.create(req.user.id, tag, trusteeId);
  next();
}

  // var query;



  // if(req.scope == 'category') {
  //   query = Delegation.findOne({truster: req.user.id, scope: req.scope, category: req.param('category')});
  // } else {
  //   query = Delegation.findOne({truster: req.user.id, scope: req.scope, issue: req.param('issue')});
  // }

  // query.exec(function(err, delegation) {
  //   req.delegation = delegation;
  //   next()
  // });
  // 
};