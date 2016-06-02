import Store from '../store/store'
import urlBuilder from '../url-builder/url-builder'

class ForumStore extends Store {
  constructor () {
    super()
    this._userForumName = null
  }

  name () {
    return 'forum'
  }

  parse (forum) {
    forum.url = urlBuilder.forum(forum) + '/'
    return Promise.resolve(forum)
  }

  clear () {
    super.clear()
    this._userForumName = null
    return this
  }

  findOneByName (name) {
    let item = this.item.find(o => o.name === name)
    if (item) return Promise.resolve(item)

    let url = this.url('', { name: name })

    if (this._fetches.get(url)) return this._fetches.get(url)

    let fetch = this._fetch(url)

    fetch.then(forum => {
      let id = forum.id
      this.set(id, forum)
    }).catch(err => {
      this.log('Found error', err)
    })

    return fetch
  }

  findUserForum () {
    let name = this._userForumName
    if (this.item.get(name)) return Promise.resolve(this.item.get(name))

    let url = this.url('mine')
    if (this._fetches.get(url)) return this._fetches.get(url)

    let fetch = this._fetch(url)

    fetch
      .then(item => {
        this._userForumName = item.name
        this.set(item.name, item)
        this.busEmit('update:mine', item)
        return item
      })
      .catch(err => {
        if (err.status === 404) return
        if (err.status === 403) return
        throw err
      })

    return fetch
  }

  destroyUserForum () {
    return this.destroy(this._userForumName)
  }
}

export default new ForumStore()
