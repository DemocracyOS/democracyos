import request from '../../request/request'
import Store from '../store/store'

class UserStore extends Store {
  name () {
    return 'user'
  }

  search (query) {
    const url = this.url('search', { q: query })

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
}

export default new UserStore()
