import debug from 'debug';
import request from '../request/request.js';
import Emitter from '../emitter/emitter.js';

let log = debug('democracyos:forum-model');

export default class Forum extends Emitter {

  constructor (opts) {
    super();

    this.$_url = opts.url;
    this.$_attrs = {};
    this.status('loading');
  }

  status (_status) {
    if (!_status) return this.$_status;
    if ('string' !== typeof _status) throw new Error('Status must be a string.');
    var oldStatus = this.$_status;
    this.$_status = _status;
    if (this.$_status !== oldStatus) {
      if (this.$_status === 'creating') {
        this.fetchTil('ready');
      } else if (this.$_status === 'destroying') {
        this.fetchTil('non-existent');
      }
      this.emit('status:change', this.$_status);
    }
    return this;
  }

  fetch () {
    if (this.$_req) return this;

    this.$_req = request
      .get(this.$_url)
      .set('Accept', 'application/json')
      .end((err, res) => {
        this.$_req = null;

        setTimeout((() => this.emit('fetch:end')), 0);
        if (err) return this.status('error');

        let forum = res.body;
        if (!forum) return this.status('non-existent');
        if ('object' !== typeof forum) throw new Error('Bad response from server.');
        this.attrs(forum);
      });

    return this;
  }

  fetchTil (til, fn) {
    let current = this.status();
    if (current === til) return fn && fn(null, current), this;

    this.once('fetch:end', () => {
      let status = this.status();
      if ('error' === status) return fn && fn(status, status);
      if (status === til) return fn && fn(null, status);
      if ('ready' === til && 'non-existent' === status) return fn && fn(null, status);
      setTimeout((() => this.fetchTil(til, fn)), 3000);
    });

    this.fetch();
  }

  onLoaded (fn) {
    if ('loading' !== this.status()) return fn(), this;
    this.once('status:change', fn);
  }

  attrs (values) {
    if (!values) return this.$_attrs;
    if ('object' !== typeof values) throw new Error('Attributes must be an object.');
    this.$_attrs = values || {};
    this.status(values.status || 'error');
  }

  attr (key) {
    if (!this.$_attrs) return;
    return this.$_attrs[key];
  }

  url () {
    var uri = this.attr('url');
    if (!uri) return '';
    return location.protocol + '//' + uri;
  }
}
