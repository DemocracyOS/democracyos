import memoize from 'lodash.memoize'
import Geopattern from 'geopattern'
import urlBuilder from 'lib/url-builder'
import Store from '../store/store'
import request from '../../request/request'
import forumStore from '../forum-store/forum-store'

const voteOptions = ['negative', 'positive', 'neutral']

class TopicStore extends Store {
  name () {
    return 'topic'
  }

  parse (topic) {
    if (!topic.forum) {
      return Promise.reject(new Error(`Topic ${topic.id} needs a forum.`))
    }

    return forumStore.findOne(topic.forum).then((forum) => {
      topic.url = urlBuilder.for('site.topic', {
        id: topic.id,
        forum: forum.name
      })

      return topic
    })
  }

  publish (id) {
    if (!this.item.get(id)) {
      return Promise.reject(new Error('Cannot publish not fetched item.'))
    }

    const promise = new Promise((resolve, reject) => {
      request
        .post(`${this.url(id)}/publish`)
        .end((err, res) => {
          if (err || !res.ok) return reject(err)

          this.parse(res.body).then((item) => {
            this.set(id, item)
            resolve(item)
          })
          .catch((err) => { console.error('topic body parse error', err) })
        })
    })

    return promise
  }

  unpublish (id) {
    if (!this.item.get(id)) {
      return Promise.reject(new Error('Cannot unpublish not fetched item.'))
    }

    const promise = new Promise((resolve, reject) => {
      request
        .post(`${this.url(id)}/unpublish`)
        .end((err, res) => {
          if (err || !res.ok) return reject(err)

          this.parse(res.body).then((item) => {
            this.set(id, item)
            resolve(item)
          })
          .catch((err) => { console.error('topic body parse error', err) })
        })
    })

    return promise
  }

  vote (id, value) {
    if (!~voteOptions.indexOf(value)) {
      return Promise.reject(new Error('Invalid vote value.'))
    }

    const promise = new Promise((resolve, reject) => {
      request
        .post(`/api/v2/topics/${id}/vote`)
        .send({ value: value })
        .end((err, res) => {
          if (err || !res.ok) return reject(err)

          this.parse(res.body.results.topic).then((topic) => {
            this.set(id, topic)
            resolve(topic)
          })
          .catch((err) => console.error('vote fail', err))
        })
    })

    return promise
  }

  poll (id, value) {
    const promise = new Promise((resolve, reject) => {
      request
        .post(`/api/v2/topics/${id}/poll`)
        .send({ value: value })
        .end((err, res) => {
          if (err || !res.ok) return reject(err)

          this.parse(res.body.results.topic).then((topic) => {
            this.set(id, topic)
            resolve(topic)
          })
          .catch((err) => console.error('poll fail', err))
        })
    })

    return promise
  }

  getCoverUrl (topic) {
    if (topic.coverUrl) return topic.coverUrl
    return getCoverUrl(topic.id)
  }
}

const getCoverUrl = memoize((id) => Geopattern.generate(id).toDataUri())

export default new TopicStore()
