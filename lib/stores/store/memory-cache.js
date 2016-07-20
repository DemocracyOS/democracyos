import find from 'mout/array/find'

export default class MemoryCache {
  constructor () {
    this.items = {}
  }

  get (id) {
    return this.items[id]
  }

  set (id, item) {
    this.items[id] = item
    return this
  }

  remove (id) {
    let item = this.items[id]
    if (!item) return null
    delete this.items[id]
    return item
  }

  clear () {
    this.items = {}
    return this
  }

  keys () {
    return Object.keys(this.items)
  }

  find (iterator) {
    return find(this.items, iterator)
  }
}
