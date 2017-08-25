import { PromiseState } from 'react-refetch'

class User {
  state = PromiseState.create()
  handlers = []

  update = (attrs, meta) => {
    if (attrs) {
      if (Object.freeze) Object.freeze(attrs)
      this.state = PromiseState.resolve(attrs, meta)
    } else {
      this.state = PromiseState.reject('loggedout', meta)
    }

    this.handlers.forEach((cb) => cb(this.state))
  }

  clear = () => {
    this.state = PromiseState.create()
    this.handlers.forEach((cb) => cb(this.state))
  }

  onChange (cb) {
    this.handlers.push(cb)
  }

  offChange (cb) {
    const i = this.handlers.indexOf(cb)
    if (i !== -1) return this.handlers.splice(i, 1)
    return null
  }

  fetching = false

  fetch = () => {
    if (!this.state.pending) return Promise.resolve()
    if (this.fetching) return this.fetching

    this.fetching = new Promise((resolve, reject) => {
      window.fetch('/api/user/me', {
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        this.fetching = null

        // Logged in
        if (res.status >= 200 && res.status < 300) return res.json()

        // Logged out
        if (res.status === 403) return null

        const err = new Error(res.statusText)
        err.res = res
        throw err
      }).then((attrs) => {
        this.update(attrs)
        resolve()
      }).catch(reject)
    })

    return this.fetching
  }

  logout = () => {
    window.fetch('/api/signin', {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((attrs) => {
      this.update(null)
    }).catch((err) => { throw err })
  }
}

export default new User()
