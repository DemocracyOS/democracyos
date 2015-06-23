import bus from 'bus';
import request from '../request/request';

export default class RemoteModel {

  constructor () {
    this._fetches = {};
    this._requests = {};
    this._destroys = {};
    this.items = {};
  }

  name () {
    throw new Error('RemoteModel must implement name():string');
  }

  url (/* id */) {
    throw new Error('RemoteModel must implement url(id):string');
  }

  parse (item) {
    return item;
  }

  unload (id) {
    if (!this.items[id]) return this;

    if (this._fetches[id]) this._requests[id].abort();

    delete this.items[id];

    bus.emit(`${this.name()}:unload:${id}`);

    return this;
  }

  get (id, ...options) {
    if (this.items[id]) return Promise.resolve(this.items[id]);
    if (this._fetches[id]) return this._fetches[id];

    this._fetches[id] = new Promise((resolve, reject) => {
      this._requests[id] = request
        .get(this.url(id, ...options))
        .end((err, res) => {
          delete this._requests[id];
          delete this._fetches[id];

          if (err || !res.ok) return reject(err || res.error);

          var u = res.body;

          if (!u || !u.id) return reject(new Error('Not found'));

          this.items[id] = this.parse(u);

          resolve(u);

          bus.emit(`${this.name()}:update:${id}`, u);
        });
    });

    return this._fetches[id];
  }

  destroy (id, ...options) {
    if (!this.items[id]) {
      return Promise.reject(new Error('Cannot delete unexistent item.'));
    }

    if (this._destroys[id]) return this._destroys[id];

    this._destroys[id] = new Promise((resolve, reject) => {
      request
        .delete(this.url(id, ...options))
        .end((err, res) => {
          delete this._destroys[id];

          if (err || !res.ok) return reject(err || res.error);

          this.unload(id);

          resolve();

          bus.emit(`${this.name()}:delete:${id}`);
        });
    });

    return this._destroys[id];
  }
}
