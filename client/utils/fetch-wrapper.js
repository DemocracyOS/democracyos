const fetchWrapper = (url, options) => {
  // Add credentials
  options.credentials = 'include'
  // If the method affects the content in the DB add the csrf token
  if (options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE') {
    options.body['_csrf'] = JSON.parse(localStorage.getItem('session')).csrfToken
    options.body = JSON.stringify(options.body)
  }

  // Do the fetch and return the response or the error msg
  return fetch(url, options)
}

module.exports = { fetchWrapper }
