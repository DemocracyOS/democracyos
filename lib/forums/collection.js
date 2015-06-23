import bus from 'bus';
import request from '../request/request';

const fetches = Symbol('fetches');
const requests = Symbol('requests');
const deletes = Symbol('deletes');

export default class Collection {

  constructor () {
    this[fetches] = {};
    this[requests] = {};
    this[deletes] = {};
    this.items = {};
  }

  name () {
    throw new Error('Collection must implement name():string');
  }

  url (/* id */) {
    throw new Error('Collection must implement url(id):string');
  }

  parse (item) {
    return item;
  }

  unload (id) {
    if (!this.items[id]) return this;

    if (this[fetches][id]) this[requests][id].abort();

    delete this.items[id];

    bus.emit(`${this.name()}:unload:${id}`);

    return this;
  }

  get (id, ...options) {
    if (this.items[id]) return Promise.resolve(this.items[id]);
    if (this[fetches][id]) return this[fetches][id];

    this[fetches][id] = new Promise((resolve, reject) => {
      this[requests][id] = request
        .get(this.url(id, ...options))
        .end((err, res) => {
          delete this[requests][id];
          delete this[fetches][id];

          if (err || !res.ok) return reject(err || res.error);

          var u = res.body;

          if (!u || !u.id) return reject(new Error('Not found'));

          this.items[id] = this.parse(u);

          resolve(u);

          bus.emit(`${this.name()}:update:${id}`, u);
        });
    });

    return this[fetches][id];
  }

  delete (id, ...options) {
    if (!this.items[id]) {
      return Promise.reject(new Error('Cannot delete unexistent item.'));
    }

    if (this[deletes][id]) return this[deletes][id];

    this[deletes][id] = new Promise((resolve, reject) => {
      request
        .delete(this.url(id, ...options))
        .end((err, res) => {
          delete this[deletes][id];

          if (err || !res.ok) return reject(err || res.error);

          this.unload(id);

          resolve();

          bus.emit(`${this.name()}:delete:${id}`, u);
        });
    });

    return this[deletes][id];
  }
}
