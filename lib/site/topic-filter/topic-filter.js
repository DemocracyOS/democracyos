import bus from 'bus'
import clone from 'mout/lang/clone'
import Storage from 'lib/storage/storage'
import sorts from './sorts'

const storage = new Storage()

class TopicFilter {
  constructor () {
    this.set = this.set.bind(this)

    this.sorts = sorts
    this.items = []
    this.filteredItems = []

    this._filter = {
      sort: storage.get('topic-store-sort') || 'newest-first',
      hideVoted: storage.get('topic-store-hide-voted') || false,
      status: storage.get('topic-store-status') || 'open'
    }

    bus.on('topic-store:update:all', this.set)
  }

  clear (trigger = true) {
    this.items = []
    this.filteredItems = []

    if (trigger) {
      bus.emit('topic-filter:update', this.filteredItems, this.getFilter())
    }
  }

  set (items) {
    this.clear(false)
    this.items = items
    this.filteredItems = this.filter(this.items)
    let filteredItems = this.get()
    bus.emit('topic-filter:update', filteredItems, this.getFilter())
    return filteredItems
  }

  get (index) {
    if (typeof index === 'number') return this.filteredItems[index]
    return this.filteredItems.splice(0)
  }

  filter (items) {
    return items.filter(item => {
      // Hide voted items
      if (this._filter.hideVoted && item.voted === true) return false
      // Filter by status
      return this._filter.status === item.status
    }).sort(this.getCurrentSort().sort)
  }

  setFilter (filter = {}) {
    Object.keys(filter).forEach(key => {
      if (undefined === this._filter[key]) return
      let value = filter[key]
      if (this._filter[key] !== value) {
        setTimeout(() => {
          storage.set(`topic-store-${key}`, filter[key])
        }, 0)
        this._filter[key] = filter[key]
      }
    })
    this.set(this.items)
    return this
  }

  getFilter () {
    return {
      filter: clone(this._filter),
      sorts: this.sorts,
      currentSort: this.getCurrentSort(),
      openCount: this.openCount(),
      closedCount: this.closedCount()
    }
  }

  getCurrentSort () {
    return this.sorts[this._filter.sort]
  }

  openCount () {
    let items = this.items
    return items.filter(i => i.publishedAt && i.status === 'open').length
  }

  closedCount () {
    let items = this.items
    return items.filter(i => i.publishedAt && i.status === 'closed').length
  }
}

export default new TopicFilter()
