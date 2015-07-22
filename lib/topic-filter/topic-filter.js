import bus from 'bus';
import clone from 'mout/lang/clone';
import Storage from '../storage/storage';
import sorts from './sorts';

const storage = new Storage;

class TopicFilter {
  constructor (options = {}) {
    this.set = this.set.bind(this);
    this.sorts = sorts;

    this.items = [];
    this._filter = {
      sort: storage.get('topic-store-sort') || 'closing-soon',
      hideVoted: storage.get('topic-store-hide-voted') || false,
      status: storage.get('topic-store-status') || 'open'
    };

    if (options.items) this.set(options.items);
  }

  set (items) {
    let sortedItems = this.filter(items);
    this.items = sortedItems;
    bus.emit('topic-filter:update', sortedItems, this.getFilter());
    return items;
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
    if (this.items.length) this.set(this.items);
    return this;
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
    return this.sorts[this._filter.sort];
  }

  openCount () {
    return this.items.filter(i => i.publishedAt && i.status == 'open').length;
  }

  closedCount () {
    return this.items.filter(i => i.publishedAt && i.status == 'closed').length;
  }
}

export default new TopicFilter;
