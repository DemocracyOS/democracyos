import local from './strategies/localStorage.js'
import cookie from './strategies/cookie.js'

/**
 * Load Storage Options
 */

let _storages = {}

function getStorage (name) {
  if (!_storages[name]) {
    if (name === 'localStorage') {
      _storages[name] = local
    } else if (name === 'cookie') {
      _storages[name] = cookie
    } else {
      throw new Error('Storage not supported: ' + name)
    }
  }

  return _storages[name]
}

/**
 * Default Options
 */

let defaults = {
  /**
   * Storage methods to use, fallbacks in order.
   * Available: ['localStorage', 'cookie']
   */
  use: ['localStorage', 'cookie']
}

/**
 * Construct a Storage instance
 */

export default class Storage {
  constructor (options) {
    options = options || defaults

    for (var i = 0; i < options.use.length; i++) {
      var storage = getStorage(options.use[i])
      if (storage.supported()) {
        this.storage = storage
        break
      }
    }
  }

  get () {
    try {
      return this.storage.get.apply(this, arguments)
    } catch (e) {
      console.log(e)
      return null
    }
  }

  set () {
    try {
      return this.storage.set.apply(this, arguments)
    } catch (e) {
      console.log(e)
      return null
    }
  }

  remove () {
    try {
      return this.storage.remove.apply(this, arguments)
    } catch (e) {
      console.log(e)
      return null
    }
  }
}
