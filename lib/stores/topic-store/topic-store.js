import memoize from 'lodash.memoize'
import Geopattern from 'geopattern'
import encode from 'mout/queryString/encode'
import urlBuilder from 'lib/url-builder'
import Store from '../store/store'
import request from '../../request/request'
import forumStore from '../forum-store/forum-store'

class TopicStore extends Store {
  name () {
    return 'topic'
  }

  url (id, params = {}) {
    if (typeof id === 'object') {
      params = id
      id = ''
    }

    id = id ? '/' + id : ''

    return `/api/v2/topics${id}${encode(params)}`
  }

  findAllSuffix () {
    return null
  }

  parseResponse ({ body }) {
    if (!body || !body.results) return Promise.resolve()

    if (body.results.topics) {
      return Promise.all(body.results.topics.map(this.parse)).then((topics) => [topics, body.pagination])
    } else if (body.results.topic) {
      return this.parse(body.results.topic)
    } else {
      return Promise.resolve()
    }
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
        .post(`/api/v2/topics/${id}/publish`)
        .end((err, res) => {
          if (err || !res.ok) return reject(err)

          this.parse(res.body.results.topic).then((item) => {
            this.set(id, item)
            resolve(item)
          }).catch(reject)
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
        .post(`/api/v2/topics/${id}/unpublish`)
        .end((err, res) => {
          if (err || !res.ok) return reject(err)

          this.parse(res.body.results.topic).then((item) => {
            this.set(id, item)
            resolve(item)
          }).catch(reject)
        })
    })

    return promise
  }

  vote (id, value) {
    const promise = new Promise((resolve, reject) => {
      request
        .post(`/api/v2/topics/${id}/vote`)
        .send({ value: value })
        .end((err, res) => {
          if (err || !res.ok) return reject(err)

          this.parseResponse(res).then((topic) => {
            this.set(id, topic)
            resolve(topic)
          }).catch(reject)
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
