import bus from 'bus';
import request from '../request/request';

const fetches = new Symbol();

export default class Collection {

  constructor () {
    this[fetches] = {};
    this.items = {};
  }

  name () {
    return 'collection';
  }

  url (id) {
    return id;
  }

  unload (id) {
    if (!this.items[id]) return;
    delete this.items[id];
    bus.emit(`${this.name}:unload:${id}`);
  }

  load (id) {
    if (this.items[id]) return this.items[id];
    if (this[fetches][id]) return this[fetches][id];

    this[fetches][id] = new Promise((resolve, reject) => {
      request
        .get(this.url(id))
        .end((err, res) => {
          delete this[fetches][id];

          if (err || !res.ok) return reject(err || res.error);

          var u = res.body;

          if (!u || !u.id) return reject(new Error('Not found'));

          this.items[id] = u;

          resolve(u);

          bus.emit(`${this.name}:load:${id}`, u);
        });
    });

    return this[fetches][id];
  }

}
