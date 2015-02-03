/**
 * Minimal Storages wrapper
 * Before using any storage option, you must check if it's compatible, e.g:
 *
 * if (!store.localStorage.supported()) {
 *   store.cookie.set(key, value)
 * }
 *
 */

/**
 * Expose Storage Implementations
 */

module.exports = {
  localStorage: require('./storages/localStorage'),
  cookie: require('./storages/cookie'),
  remote: require('./storages/remote')
}
