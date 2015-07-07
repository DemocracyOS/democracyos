import Store from '../store/store';
import request from '../request/request';

class TopicStore extends Store {
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
}

export default new TopicStore();
