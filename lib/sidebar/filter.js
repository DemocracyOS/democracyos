/**
 * Module dependencies.
 */

var citizen = require('citizen');
var closest = require('closest');
var filter = require('laws-filter');
var render = require('render');
var t = require('t');
var template = require('./filter-container');
var StatefulView = require('stateful-view');

function FilterView() {
  if (!(this instanceof FilterView)) {
    return new FilterView();
  };

  StatefulView.call(this, template, { filter: filter, formatNumber: formatNumber });

  this.statuses = this.find('[data-status]');
  this.open = this.find('[data-status="open"]');
  this.closed = this.find('[data-status="closed"]');
  this.current = this.find('.current-department .pull-left');
  this.sorts = this.find('[data-sort]');
  this.hideVoted = this.find('#hide-voted-filter');
}

StatefulView(FilterView);

FilterView.prototype.switchOn = function() {
  // View events
  this.bind('click', '#status-filter a.btn', 'onstatusclick');
  this.bind('click', '#sort-filter ul li', 'onsortclick');
  this.bind('click', '#hide-voted-filter input[name=hide-voted]', 'onhidevotedclick');

  // Behavior events
  filter.on('change', this.bound('refresh'));
  citizen.on('loaded', this.bound('refresh'));
  citizen.on('unloaded', this.bound('refresh'));
}

FilterView.prototype.switchOff = function() {
  filter.off('change', this.bound('refresh'));
  citizen.off('loaded', this.bound('refresh'));
  citizen.off('unloaded', this.bound('refresh'));
}

FilterView.prototype.refresh = function() {
  var active = this.find('[data-status=":status"]'.replace(':status', filter.get('status')));
  var obj = this.find('li[data-sort="closing-soon"]');
  var open = formatNumber(filter.countFiltered('open'));
  var closed = formatNumber(filter.countFiltered('closed'));

  this.statuses.removeClass('active');
  active.addClass('active');
  this.open.html(open + t('sidebar.open'));
  this.closed.html(closed + t('sidebar.closed'));
  this.current.html(t(filter.sorts[filter.get('sort')].label));
  this.sorts.removeClass('active');
  this.find('[data-sort=":sort"]'.replace(':sort', filter.get('sort'))).addClass('active');
  if (citizen.logged()) {
    this.hideVoted.removeClass('hide');
  } else {
    this.hideVoted.addClass('hide');
  }
  if (filter.get('status') == 'closed') {
    obj.addClass('hide');
    if (filter.get('sort') == 'closing-soon') filter.set('sort', 'newest-first');
  } else {
    obj.removeClass('hide');
  }
  this.find('input#hide-voted')[0].checked = filter.get('hide-voted') ? true : null;
};

FilterView.prototype.onstatusclick = function(ev) {
  ev.preventDefault();

  var target = ev.delegateTarget || closest(ev.target, '[data-status]', true);
  var status = target.getAttribute('data-status');

  filter.set('status', status);
}

FilterView.prototype.onsortclick = function(ev) {
  ev.preventDefault();

  var target = ev.delegateTarget || closest(ev.target, '[data-sort]', true);
  var sort = target.getAttribute('data-sort');

  filter.set('sort', sort);
}

FilterView.prototype.onhidevotedclick = function(ev) {
  ev.preventDefault();

  var target = ev.delegateTarget || closest(ev.target, '[type=checkbox]', true);
  var checked = !!target.checked;

  filter.set('hide-voted', checked);
}

FilterView.prototype.ready = function(fn) {
  filter.ready(fn);
  filter.ready(this.bound('refresh'));
}

function formatNumber(v) {
  return v <= 99 ? v + ' ' : '99+ ';
};

module.exports = new FilterView();