import Store from '../store/store';
import request from '../request/request';
import config from '../config/config';
import forumStore from '../forum-store/forum-store';
import urlBuilder from '../url-builder/url-builder';

class TopicStore extends Store {
  name () {
    return 'topic';
  }

  parse (topic) {
    if (config.multiForum && !topic.forum) {
      throw new Error(`Topic ${topic.id} needs a forum.`);
    }

    return forumStore.findOne(topic.forum).then(forum => {
      topic.url = urlBuilder.topic(topic, forum);
      return topic;
    }).catch(err => {
      throw err;
    });
  }

  publish (id) {
    if (!this.item.get(id)) {
      return Promise.reject(new Error('Cannot publish not fetched item.'));
    }

    let pub = new Promise((resolve, reject) => {
      request
        .post(`${this.url(id)}/publish`)
        .end((err, res) => {
          if (err || !res.ok) return reject(err);

          this.parse(res.body).then(item => {
            this.item.set(id, item);
            resolve(item);
            this.busEmit(`update:${id}`, item);
          });
        });
    });

    return pub;
  }
}

export default new TopicStore;
