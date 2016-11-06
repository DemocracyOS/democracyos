import {PromiseState} from 'react-refetch'

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
    if (!this.state.pending) return this.state
    if (this.fetching) return this.fetching

    const promise = fetch('/api/user/me', {
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      this.fetching = null

      if (res.status >= 200 && res.status < 300) {
        return res.json()
      }

      const err = new Error(res.statusText)
      err.res = res
      throw err
    }).then(this.update).catch((err) => {
      if (err.res.status === 403) {
        this.update(null) // the user is logged out
      } else {
        throw err // unhandled error
      }
    })

    this.fetching = promise

    return promise
  }

  logout = () => {
    fetch('/api/signin', {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })

    this.state = PromiseState.reject('loggedout')
    this.handlers.forEach((cb) => cb(this.state))
  }
}

export default new User()
