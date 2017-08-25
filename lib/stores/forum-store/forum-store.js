import request from '../../request/request'
import Store from '../store/store'
import urlBuilder from '../../url-builder'

class ForumStore extends Store {
  constructor () {
    super()

    this._findForumSearchCache = {
      url: null,
      items: []
    }
  }

  name () {
    return 'forum'
  }

  parse (forum) {
    forum.url = urlBuilder.for('site.forum', { forum: forum.name })
    return Promise.resolve(forum)
  }

  findOneByName (name) {
    let item = this.item.find((o) => o.name === name)
    if (item) return Promise.resolve(item)

    let url = this.url('', { name: name })

    if (this._fetches.get(url)) return this._fetches.get(url)

    let fetch = this._fetch(url)

    fetch.then((forum) => {
      let id = forum.id
      this.set(id, forum)
    }).catch((err) => {
      this.log('Found error', err)
    })

    return fetch
  }

  search (q, page) {
    let url = `/api/v2/search/forums?q=${q}&page=${page}`

    if (this._findForumSearchCache.url === url) {
      return Promise.resolve(this._findForumSearchCache.items)
    }

    if (this._fetches.get(url)) return this._fetches.get(url)

    const fetch = this._fetch(url)

    fetch.then((body) => {
      return Promise.all(body.results.forums.map(this.parse))
    }).then((items) => {
      this._findForumSearchCache = {
        url: url,
        items: items
      }
    }).catch((err) => {
      this.log('Found error', err)
    })

    return fetch
  }

  getPermissions (id) {
    const url = this.url(id) + '/permissions'

    const fetch = new Promise((resolve, reject) => {
      request
        .get(url)
        .end((err, res) => {
          if (err) return reject(err)
          resolve(res.body)
        })
    })

    return fetch
  }

  grantPermission (id, user, role) {
    const url = this.url(id) + '/permissions'

    const fetch = new Promise((resolve, reject) => {
      request
        .post(url)
        .send({ user, role })
        .end((err, res) => {
          if (err) return reject(err)
          resolve(res.body)
          this.busEmit('permission:grant', id, user, role)
        })
    })

    return fetch
  }

  revokePermission (id, user, role) {
    const url = this.url(id) + '/permissions'

    const fetch = new Promise((resolve, reject) => {
      request
        .del(url)
        .send({ user, role })
        .end((err, res) => {
          if (err) return reject(err)
          resolve(res.body)
          this.busEmit('permission:revoke', id, user, role)
        })
    })

    return fetch
  }

  findTags (id) {
    return window.fetch(`/api/v2/forums/${id}/tags`)
      .then((res) => {
        if (res.status >= 200 && res.status < 300) return res.json()

        const err = new Error(res.statusText)
        err.res = res
        throw err
      })
      .then((res) => res.results.tags)
      .catch((err) => { throw err })
  }
}

export default new ForumStore()
