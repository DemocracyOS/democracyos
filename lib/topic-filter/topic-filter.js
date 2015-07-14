import bus from 'bus';
import sort from 'mout/array/sort';
import Storage from '../storage/storage';
import topicStore from '../topic-store/topic-store';
import sorts from './sorts';

const storage = new Storage;

class TopicFilter {
  constructor () {
    this.setSort(storage.get('topic-store-sort') || 'closing-soon');
  }

  findAll (...args) {
    return topicStore.findAll(...args).then((items) => {
      let sortedItems = this.sort(items);
      bus.emit('topic-filter:update', sortedItems);
      return sortedItems;
    }).catch(err => { throw err; });
  }

  sort (items) {
    return sort(items, this._sortFn);
  }

  setSort (by) {
    if (!sorts[by]) throw new Error(`Sort '${by}' does not exist.`);
    storage.set('topic-store-sort', by);
    this._sortFn = sorts[by];
    return this;
  }
}

export default new TopicFilter;
