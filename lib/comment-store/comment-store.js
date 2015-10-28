import Store from '../store/store';
import request from '../request/request';
import config from '../config/config';
import forumStore from '../forum-store/forum-store';
import urlBuilder from '../url-builder/url-builder';

/**
 * Use findAll with to
 */

class CommentStore extends Store {
  constructor() {
    super();
  }

  name () {
    return 'comment';
  }

  parse (comment) {
    return Promise.resolve(comment);
  }

  /**
   * Get all replies
   *
   * @param {String} id
   * @return {Promise} promise
   * @api public
   */
  replies (id) {
    let promise = new Promise((resolve, reject) => {
      request
        .get(`${this.url(id)}/replies`)
        .end((err, res) => {
          if (err || !res.ok) return reject(err);

          this.parse(res.body).then(item => {
            resolve(item);
          });
        });
    });

    return promise;
  }

  /**
   * Copy of findAll but with my-comments in url
   *
   * @param {String} id
   * @return {Promise} fetch
   * @api public
   */
  myComments (...args) {
    let url = this.url('my-comments', ...args);

    if (this._fetches.get(url)) return this._fetches.get(url);

    let fetch = this._fetch(url);

    fetch.then(items => {
      this.busEmit('update:all', items);
    }).catch(err => {
      this.log('Found error', err);
    });

    return fetch;
  }

  /**
   * Copy of findAll but with sidecomments in url
   *
   * @param {String} id
   * @return {Promise} fetch
   * @api public
   */
  sideComments (...args) {
    let url = this.url('sidecomments', ...args);

    if (this._fetches.get(url)) return this._fetches.get(url);

    let fetch = this._fetch(url);

    fetch.then(items => {
      this.busEmit('update:all', items);
    }).catch(err => {
      this.log('Found error', err);
    });

    return fetch;
  }

  comment (id, comment) {
    let promise = new Promise((resolve, reject) => {
      request
        .post(`${this.url('comment')}`)
        .query({id: id})
        .send(comment)
        .end((err, res) => {
          if (err || !res.ok) return reject(err);

          this.parse(res.body).then(item => {
            this.set(id, item);
            resolve(item);
          });
        });
    });

    return promise;
  }

  reply (id, reply) {
    let promise = new Promise((resolve, reject) => {
      request
        .post(`${this.url(id)}/reply`)
        .send({reply: reply})
        .end((err, res) => {
          if (err || !res.ok) return reject(err);

          this.parse(res.body).then(item => {
            this.set(id, item);
            resolve(item);
          });
        });
    });

    return promise;
  }

  vote (id, voting) {
    return this.simplePostWrapper(id, voting);
  }

  flag (id, flagging) {
    return this.simplePostWrapper(id, flagging);
  }

  simplePostWrapper (id, endpoint) {
    let promise = new Promise((resolve, reject) => {
      request
        .post(`${this.url(id)}/${endpoint}`)
        .end((err, res) => {
          if (err || !res.ok) return reject(err);

          resolve(res);
        });
    });

    return promise;
  }

  editComment (id, comment) {
    let promise = new Promise((resolve, reject) => {
      request
        .put(`${this.url(id)}`)
        .send({comment: comment})
        .end((err, res) => {
          if (err || !res.ok) return reject(err);

          this.parse(res.body).then(item => {
            this.set(id, item);
            resolve(item);
          });
        });
    });

    return promise;
  }

  editReply (commentId, replyId, reply) {
    let promise = new Promise((resolve, reject) => {
      request
        .put(`${this.url(commentId)}/reply/${replyId}`)
        .send({reply: reply})
        .end((err, res) => {
          if (err || !res.ok) return reject(err);

          this.parse(res.body).then(item => {
            this.set(commentId, item);
            resolve(item);
          });
        });
    });

    return promise;
  }

  destroyReply (commentId, replyId) {
    let promise = new Promise((resolve, reject) => {
      request
        .del(`${this.url(commentId)}/reply/${replyId}`)
        .end((err, res) => {
          if (err || !res.ok) return reject(err);

          this.parse(res.body).then(item => {
            resolve(item);
          });
        });
    });

    return promise;
  }
}

export default new CommentStore;
