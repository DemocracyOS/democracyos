import Store from '../store/store';
import request from '../request/request';
import sorts from './topic-sorts';
import Storage from '../storage/storage';

const storage = new Storage;

class TopicStore extends Store {
  constructor () {
    super();
    this.initSort();
  }

  name () {
    return 'topic';
  }

  publish (id) {
    if (!this.items.get(id)) {
      return Promise.reject(new Error('Cannot publish not fetched item.'));
    }

    let pub = new Promise((resolve, reject) => {
      request
        .post(`${this.url(id)}/publish`)
        .end((err, res) => {
          if (err || !res.ok) return reject(err);

          let item = this.parse(res.body);
          this.items.set(id, item);

          resolve(item);

          this.busEmit(`update:${id}`, item);
        });
    });

    return pub;
  }

  sort (items) {
    return items.sort(this._sortFn);
  }

  setSort (by) {
    if (!sorts[by]) throw new Error(`Sort '${by}' does not exist.`);
    storage.set('topic-store-sort', by);
    this._sortFn = sorts[by];
    return this;
  }

  initSort () {
    this.setSort(storage.get('topic-store-sort') || 'closing-soon');
  }
}

export default new TopicStore();
