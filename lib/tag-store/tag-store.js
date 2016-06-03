import Store from '../store/store'

class TagStore extends Store {
  name () {
    return 'tag'
  }
}

export default new TagStore()
