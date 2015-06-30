export default class MemoryCache {
  constructor () {
    this.items = {};
  }

  get (id) {
    return this.items[id];
  }

  set (id, item) {
    this.items[id] = item;
    return item;
  }

  remove (id) {
    let item = this.items[id];
    if (!item) return null;
    delete this.items[id];
    return item;
  }
}
