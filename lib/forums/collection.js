import bus from 'bus';
import request from '../request/request';

const fetches = new Symbol('collection.fetches');

export default class Collection {

  constructor () {
    this[fetches] = {};
    this.items = {};
  }

  name () {
    throw new Error('Collection must implement name():string');
  }

  url (/* id */) {
    throw new Error('Collection must implement url(id):string');
  }

  unload (id) {
    if (!this.items[id]) return this;

    delete this.items[id];

    if (this[fetches][id]) {
      if (this[fetches][id].req) this[fetches][id].req.abort();
      delete this[fetches][id];
    }

    bus.emit(`${this.name()}:unload:${id}`);

    return this;
  }

  load (id, ...extra) {
    if (this.items[id]) return Promise.resolve(this.items[id]);
    if (this[fetches][id]) return this[fetches][id];

    this[fetches][id] = new Promise((resolve, reject) => {
      this[fetches][id].req = request
        .get(this.url(id, ...extra))
        .end((err, res) => {
          delete this[fetches][id];

          if (err || !res.ok) return reject(err || res.error);

          var u = res.body;

          if (!u || !u.id) return reject(new Error('Not found'));

          this.items[id] = u;

          resolve(u);

          bus.emit(`${this.name()}:load:${id}`, u);
        });
    });

    return this[fetches][id];
  }
}
