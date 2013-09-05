/**
 * Module dependencies.
 */

var express = require('express')
  , restrict = require('lib/utils').restrict
  , api = require('lib/db-api')
  , log = require('debug')('delegation');

var app = module.exports = express();

app.post('/delegations/create', restrict, loadDelegationScope, loadDelegation, createDelegation, function(req, res) {
  res.send(req.delegation ? req.delegation.id : '');
});

app.post('/delegations/delete', restrict, loadDelegationScope, loadDelegation, deleteDelegation, function(req, res) {
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