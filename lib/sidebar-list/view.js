/**
 * Module dependencies.
 */

var domify = require('domify');
var events = require('events');
var empty = require('empty');
var blockList = require('./list-block');
var listItem = require('./list-item');
var filterItem = require('./filter-item');
var Emitter = require('emitter');
var classes = require('classes');
var closest = require('closest');
var t = require('t');
var log = require('debug')('democracyos:sidebar-list:view');

/**
 * Expose View
 */

module.exports = View;

/**
 * Create Sidebar List view container
 */

function View(items, type) {
  if (!(this instanceof View)) {
    return new View(items, type);
  };

  this.el = domify(blockList({ type: type, t: t }));
  this.events = events(this.el, this);
  this.items = items || [];
  this.type = type || 'law';

  this.switchOn();
}

Emitter(View.prototype);

View.prototype.switchOn = function() {
  log('switch on');
  this.events.bind('click ul.dropdown-menu li', 'onfilterselect');
}

View.prototype.switchOff = function() {
  this.events.unbind();
}

View.prototype.set = function(v) {
  this.items = v;
  this.refreshFilters();
  return this.build();
}

View.prototype.add = function(i) {
  this.items.push(i);
  return this;
}

View.prototype.append = function(item) {
  var list = this.el.querySelector('ul.nav.navlist');
  var itemEl = domify(listItem({ item: item, listType: this.type, t: t }));
  list.appendChild(itemEl);
  return this;
}

View.prototype.render = function(el) {
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

View.prototype.build = function() {
  var list = this.el.querySelector('ul.nav.navlist');
  empty(list);
  this.items.sort(function(a,b) {
    if (a.closingAt != b.closingAt) {
      if (a.closingAt==undefined) {
        return 1;
      } else if (b.closingAt==undefined) {
        return -1;
      } else if (+a.closingAt<+b.closingAt) {
        return -1;
      } else {
        return 1;
      }
    } else {      
      if (a.participants.length>b.participants.length) {
        return -1;
      } else {
        return 1;
      }
    }     
  });
  this.items.forEach(function(item) {
    this.append(item)
  }, this);

  return this;
}

View.prototype.select = function(id) {
  var els = this.el.querySelectorAll('ul.nav.navlist li');
  var el = this.el.querySelector('ul.nav.navlist li[data-id="' + id + '"]');

  if (el) {
    for (var i = 0; i < els.length; i++) {
      classes(els[i]).remove('active');
    };
    classes(el).add('active');
  }

  return this;
}

View.prototype.selected = function() {
  var el = this.el.querySelector('ul.nav.navlist li.active');
  var id = el ? el.getAttribute('data-id') : null;

  return id ? get(this.items, 'id === "%id"'.replace('%id', id)) : null;
}

View.prototype.refreshFilters = function() {
  var container = this.el.querySelector('ul.dropdown-menu');
  var map = [];
  this.filters = this.items.map(function(item) {
    var tag = item.tag;
    if (!~map.indexOf(tag.hash)) {
      map.push(tag.hash);
      return tag;
    };
    return null;
  }).filter(function(tag) {
    return tag;
  });

  this.filters.unshift({
    id: 'all',
    hash: 'all',
    name: t('sidebar-list.listing{listType}', { listType: this.type })
  });

  empty(container);

  this.filters.forEach(function(f) {
    container.appendChild(domify(filterItem({ filter: f })));
  });

  return this;
}

View.prototype.onfilterselect = function(ev) {
  ev.preventDefault();

  var list = this.el.querySelector('ul.nav.navlist');
  empty(list);

  var target = ev.delegateTarget || closest(ev.target, '[data-id]');
  var id = target.getAttribute('data-id');

  log('filter select click %s', id);

  var items = 'all' === id ? this.items : this.items.filter(function(i) {
    return i.tag.id === id;
  });

  items.forEach(function(item) {
    this.append(item);
  }, this);

  // Update current filter box text
  var tag = get(this.filters, 'id === "%id"'.replace('%id', id));
  this.el.querySelector('.dropdown-department .current-department').innerHTML = tag.name;
}

function get(list, query) {
  var match;
  var test = new Function('_', 'return _.' + query);

  list.some(function(l) {
    if (test(l)) {
      match = l;
      return true;
    };
    return false;
  });
  return match || null;
}