import request from 'lib/request/request'
import Store from '../store/store'

/**
 * Use findAll with to
 */

export class CommentsStore extends Store {
  name () {
    return 'comments'
  }

  prefix () {
    return '/api/v2/'
  }

  findAllPrefix () {
    return ''
  }

  /**
   * Get all replies
   *
   * @param {String} id
   * @return {Promise} promise
   * @api public
   */
  replies (id) {
    return new Promise((resolve, reject) => {
      request
        .get(`${this.url(id)}/replies`)
        .end((err, res) => {
          if (err || !res.ok) return reject(err)
          this.parse(res.body).then(resolve)
        })
    })
  }

  comment (id, comment) {
    let promise = new Promise((resolve, reject) => {
      request
        .post(`${this.url('comment')}`)
        .query({id: id})
        .send(comment)
        .end((err, res) => {
          if (err || !res.ok) return reject(err)

          this.parse(res.body).then(item => {
            this.set(id, item)
            resolve(item)
          })
        })
    })

    return promise
  }

  reply (id, reply) {
    let promise = new Promise((resolve, reject) => {
      request
        .post(`${this.url(id)}/reply`)
        .send({reply: reply})
        .end((err, res) => {
          if (err || !res.ok) return reject(err)

          this.parse(res.body).then(item => {
            this.set(id, item)
            resolve(item)
          })
        })
    })

    return promise
  }

  vote (id, voting) {
    return this.simplePostWrapper(id, voting)
  }

  flag (id, flagging) {
    return this.simplePostWrapper(id, flagging)
  }

  simplePostWrapper (id, endpoint) {
    let promise = new Promise((resolve, reject) => {
      request
        .post(`${this.url(id)}/${endpoint}`)
        .end((err, res) => {
          if (err || !res.ok) return reject(err)

          resolve(res)
        })
    })

    return promise
  }

  editComment (id, comment) {
    let promise = new Promise((resolve, reject) => {
      request
        .put(this.url(id))
        .send({comment: comment})
        .end((err, res) => {
          if (err || !res.ok) return reject(err)

          this.parse(res.body).then(item => {
            this.set(id, item)
            resolve(item)
          })
        })
    })

    return promise
  }

  editReply (commentId, replyId, reply) {
    let promise = new Promise((resolve, reject) => {
      request
        .put(`${this.url(commentId)}/reply/${replyId}`)
        .send({reply: reply})
        .end((err, res) => {
          if (err || !res.ok) return reject(err)

          this.parse(res.body).then(item => {
            this.set(commentId, item)
            resolve(item)
          })
        })
    })

    return promise
  }

  destroyReply (commentId, replyId) {
    let promise = new Promise((resolve, reject) => {
      request
        .del(`${this.url(commentId)}/reply/${replyId}`)
        .end((err, res) => {
          if (err || !res.ok) return reject(err)

          this.parse(res.body).then(item => {
            resolve(item)
          })
        })
    })

    return promise
  }
}

const store = window.commentsStore = new CommentsStore()

export default store
