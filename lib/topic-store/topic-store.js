import Store from '../store/store';
import request from '../request/request';
import config from '../config/config';
import forumStore from '../forum-store/forum-store';
import urlBuilder from '../url-builder/url-builder';

const voteOptions = ['negative', 'positive', 'neutral'];

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

    let promise = new Promise((resolve, reject) => {
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

    return promise;
  }

  vote (id, value) {
    if (!this.item.get(id)) {
      return Promise.reject(new Error('Cannot vote not fetched item.'));
    }

    if (!~voteOptions.indexOf(value)) {
      return Promise.reject(new Error('Invalid vote value.'));
    }

    let promise = new Promise((resolve, reject) => {
      request
        .post(`${this.url(id)}/vote`)
        .send({ value: value })
        .end((err, res) => {
          if (err || !res.ok) return reject(err);

          this.parse(res.body).then(item => {
            this.item.set(id, item);
            resolve(item);
            this.busEmit(`update:${id}`, item);
          });
        });
    });

    return promise;
  }
}

export default new TopicStore;
