import bus from 'bus';
import clone from 'mout/lang/clone';
import Storage from '../storage/storage';
import sorts from './sorts';

const storage = new Storage;

class TopicFilter {
  constructor (options = {}) {
    this.set = this.set.bind(this);
    this.onItemUpdate = this.onItemUpdate.bind(this);
    this.onItemDestroy = this.onItemDestroy.bind(this);

    this.sorts = sorts;
    this.items = [];
    this.filteredItems = [];

    this._filter = {
      sort: storage.get('topic-store-sort') || 'newest-first',
      hideVoted: storage.get('topic-store-hide-voted') || false,
      status: storage.get('topic-store-status') || 'open'
    };

    if (options.items) this.reset(options.items);
  }

  clear () {
    this.items.forEach(item => {
      bus.off(`topic-store:update:${item.id}`, this.onItemUpdate);
      bus.off(`topic-store:destroy:${item.id}`, this.onItemDestroy);
    });

    this.items = [];
    this.filteredItems = [];

    bus.emit('topic-filter:update', this.filteredItems, this.getFilter());
  }

  set (items) {
    this.clear();
    this.items = items;

    this.items.forEach(item => {
      bus.on(`topic-store:update:${item.id}`, this.onItemUpdate);
      bus.on(`topic-store:destroy:${item.id}`, this.onItemDestroy);
    });

    this.filteredItems = this.filter(this.items);
    bus.emit('topic-filter:update', this.filteredItems, this.getFilter());
    return this.filteredItems;
  }

  onItemUpdate (item) {
    let index = this.items.findIndex(i => item.id === i.id);
    this.items[index] = item;

    this.filteredItems = this.filter(this.items);

    bus.emit('topic-filter:update', this.filteredItems, this.getFilter());
  }

  onItemDestroy (item) {
    let index = this.items.findIndex(i => item.id === i.id);
    this.items.splice(index, 1);

    let filteredIndex = this.filteredItems.findIndex(i => item.id === i.id);
    this.filteredItems.splice(filteredIndex, 1);

    bus.emit('topic-filter:update', this.filteredItems, this.getFilter());
  }

  filter (items) {
    return items.filter(item => {
      // Hide voted items
      if (this._filter.hideVoted && true === item.voted) return false;
      // Filter by status
      return this._filter.status === item.status;
    }).sort(this.getCurrentSort().sort);
  }

  setFilter (filter = {}) {
    Object.keys(filter).forEach(key => {
      if (undefined === this._filter[key]) return;
      let value = filter[key];
      if (this._filter[key] !== value) {
        setTimeout(() => {
          storage.set(`topic-store-${key}`, filter[key]);
        }, 0);
        this._filter[key] = filter[key];
      }
    });
    this.set(this.items);
    return this;
  }

  getFilter () {
    return {
      filter: clone(this._filter),
      sorts: this.sorts,
      currentSort: this.getCurrentSort(),
      openCount: this.openCount(),
      closedCount: this.closedCount()
    };
  }

  getCurrentSort () {
    return this.sorts[this._filter.sort];
  }

  openCount () {
    let items = this.items;
    return items.filter(i => i.publishedAt && i.status == 'open').length;
  }

  closedCount () {
    let items = this.items;
    return items.filter(i => i.publishedAt && i.status == 'closed').length;
  }
}

export default new TopicFilter;

export * from './middlewares';
