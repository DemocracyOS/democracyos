/**
 * Module dependencies.
 */

import debug from 'debug';
import merge from 'merge';
import Stateful from '../stateful/stateful.js';
import Storage from '../storage/storage.js';
import topics from '../topics/topics.js';
import user from '../user/user.js';
import sorts from './sorts.js';

let log = debug('democracyos:topics-filter');
let storage = new Storage;

class TopicsFilter extends Stateful {
  constructor () {
    super();
    this.reset = this.reset.bind(this);
    this.fetch = this.fetch.bind(this);
    this.refresh = this.refresh.bind(this);
    this.ontopicsload = this.ontopicsload.bind(this);
    this.middleware = this.middleware.bind(this);

    this.state('initializing');
    this.initialize();

    topics.on('loaded', this.ontopicsload);

    //TODO: make all this dependent on `bus` when making views reactive in #284
    user.on('loaded', this.refresh);
    user.on('unloaded', this.reset);
  }

  /**
   * Initialize `$_filters`, `$_items`, `$_counts`, and `sorts`
   *
   * @api private
   */

  initialize () {
    this.$_items = [];
    this.$_counts = [];

    // TODO: remove this hardcode and use a default sort (maybe by config?)
    this.$_filters = {};
    this.$_filters['sort'] = 'closing-soon';
    this.$_filters['status'] = 'open';

    this.sorts = sorts;
  }

  /**
   * Re-fetch after `topics.ready` state
   *
   * @api private
   */

  refresh () {
    topics.ready(this.fetch);
  }

  /**
   * Reset filter with defaults
   *
   * @api private
   */

  reset () {
    this.initialize();
    this.set( { sort: 'closing-soon', status: 'open', 'hide-voted': false } );
  }

  /**
   * Re-fetch on `topics.ready`
   */

  ontopicsload () {
    topics.ready(this.fetch);
  }

  /**
   * When a topic gets voted
   */

  vote (id) {
    var view = this;

    topics.get().forEach(function(item) {
      if (item.id === id && !item.voted) {
        item.voted = true;
        item.participants.push(user.id);
        view.reload();
      }
    });
  };

  /**
   * Fetch for filters
   */

  fetch () {
    if (!user.logged()){
      this.reset();
      this.state('loaded');
    } else {
      storage.get('topics-filter', (err, data) => {
        if (err) log('unable to fetch');
        this.set(data);
        this.state('loaded');
      });
    }
  }

  items (v) {
    if (0 === arguments.length) {
      return this.$_items;
    }

    this.$_items = v;
  }

  /**
   * Get all current `$_filters` or just the
   * one provided by `key` param
   *
   * @param {String} key
   * @return {Array|String} all `$_filters` or just the one by `key`
   * @api public
   */

  get (key) {
    if (0 === arguments.length) {
      return this.$_filters;
    };

    return this.$_filters[key];
  }

  /**
   * Set `$_filters` to whatever provided
   *
   * @param {String|Object} key to set `value` or `Object` of `key-value` pairs
   * @param {String} value
   * @return {TopicsFilter} Instance of `TopicsFilter`
   * @api public
   */

  set (key, value) {
    if (2 === arguments.length) {
      // Create param object and call recursively
      var obj = {};
      return obj[key] = value, this.set(obj);
    }

    // key is an object
    merge(this.$_filters, key);

    // notify change of filters
    this.ready(onready.bind(this));

    function onready() {
      this.emit('change', this.get());
    }

    // reload items with updated filters
    this.reload();

    // save current state
    return this.save();
  }

  /**
   * Save current filter `$_filters` to
   * `storage` if possible.
   *
   * @return {TopicsFilter} Instance of `TopicsFilter`
   * @api public
   */

  save () {
    if (user.logged()) {
      storage.set('topics-filter', this.get(), onsave.bind(this));
    }

    function onsave(err, ok) {
      if (err) return log('unable to save');
      log('saved');
    }

    return this;
  }

  /**
   * Reload items with current `$_filters`
   * and emit `reload` after filtering/sorting
   *
   * @return {TopicsFilter} Instance of `TopicsFilter`
   * @api public
   */

  reload () {
    log('reload items');

    var items = topics.get();
    if (!items) return;

    var status = this.get('status');
    var sortType = this.get('sort');
    var sortFn = sorts[sortType].sort;
    var hideVoted = this.get('hide-voted');

    this.$_counts['open'] = items.filter(i => i.publishedAt && i.status == 'open').length;
    this.$_counts['closed'] = items.filter(i => i.publishedAt && i.status == 'closed').length;

    // TODO: remove this once #288 is closed
    // Always exclude drafts
    items = items.filter(i => i.publishedAt != null);

    // Filter by status
    items = items.filter(i => i.status === status);

    // Check if logged user's id is in the topic's participants
    if (hideVoted) {
      items = items.filter(function(item) {
        return true !== item.voted;
      });
    }

    // Sort filtered
    items = items.sort(sortFn);

    // save items
    this.items(items);

    this.ready(onready.bind(this));

    function onready() {
      this.emit('reload', this.items());
    };

    return this;
  }

  /**
   * Counts topics under a specific
   * status, without side-effect
   *
   * @param {String} status filter criteria
   * @return {Number} Count of topics with `status` status
   */

  countFiltered (status) {
    // (?) Maybe this should be done on demand, and
    // provide the with the actual open topics count
    // post filters applied
    //
    // Example:
    //
    //    return (this.items() || [])
    //      .filter(_({ status: status }))
    //      .length;

    return this.$_counts[status];
  }

  middleware (ctx, next) {
    this.ready(next);
  }
}

/**
 * Expose a `TopicsFilter` instance
 */

export default new TopicsFilter;
