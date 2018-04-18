// in src/restClient
import {
  GET_LIST,
  GET_ONE,
  GET_MANY,
  // GET_MANY_REFERENCE,
  CREATE,
  UPDATE,
  DELETE,
  fetchUtils
} from 'admin-on-rest'
import { stringify } from 'query-string'

const API_URL = '/api/v1.0'

/**
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The REST request params, depending on the type
 * @returns {Object} { url, options } The HTTP request parameters
 */
const convertRESTRequestToHTTP = (type, resource, params) => {
  let url = ''
  const options = {}
  switch (type) {
    case GET_LIST: {
      const { page, perPage } = params.pagination
      const { field, order } = params.sort
      const query = {
        sort: JSON.stringify([field, order]),
        page: JSON.stringify(page),
        limit: JSON.stringify(perPage),
        filter: JSON.stringify(params.filter)
      }
      url = `${API_URL}/${resource}?${stringify(query)}`
      break
    }
    case GET_ONE:
      if (resource === 'settings' && params === undefined) {
        url = `${API_URL}/${resource}`
      } else {
        url = `${API_URL}/${resource}/${params.id}`
      }
      break
    case UPDATE:
      url = `${API_URL}/${resource}/${params.id}`
      options.method = 'PUT'
      options.body = params.data
      options.body['_csrf'] = JSON.parse(localStorage.getItem('session')).csrfToken
      options.body = JSON.stringify(options.body)
      break
    case CREATE:
      url = `${API_URL}/${resource}`
      options.method = 'POST'
      options.body = params.data
      options.body['_csrf'] = JSON.parse(localStorage.getItem('session')).csrfToken
      options.body = JSON.stringify(options.body)
      break
    case DELETE:
      url = `${API_URL}/${resource}/${params.id}`
      options.method = 'DELETE'
      options.body['_csrf'] = JSON.parse(localStorage.getItem('session')).csrfToken
      options.body = JSON.stringify(options.body)
      break
    case GET_MANY:
      const query = {
        ids: JSON.stringify(params.ids)
      }
      url = `${API_URL}/${resource}?${stringify(query)}`
      options.method = 'GET'
      break
    default:
      throw new Error(`Unsupported fetch action type ${type}`)
  }
  return { url, options }
}

/**
 * @param {Object} response HTTP response from fetch()
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The REST request params, depending on the type
 * @returns {Object} REST response
 */
const convertHTTPResponseToREST = (response, type, resource, params) => {
  const { json } = response
  switch (type) {
    case GET_LIST:
      return {
        data: json.results.map((x) => {
          Object.defineProperty(x, 'id', {
            value: x._id
          })
          return x
        }),
        total: parseInt(json.pagination.count)
      }
    case CREATE:
      return { data: { ...params.data, id: json._id } }
    case UPDATE:
      return { data: { ...params.data, id: json._id } }
    case DELETE:
      return { data: { id: json.id } }
    case GET_ONE:
      return { data: json }
    case GET_MANY:
      return {
        data: json.results.map((x) => {
          Object.defineProperty(x, 'id', {
            value: x._id
          })
          return x
        }),
        total: parseInt(json.pagination.count)
      }
    default:
      return { data: { json } }
  }
}

/**
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the request type
 * @returns {Promise} the Promise for a REST response
 */
export default (type, resource, params) => {
  const { fetchJson } = fetchUtils
  const { url, options } = convertRESTRequestToHTTP(type, resource, params)
  options.credentials = 'include'
  return fetchJson(url, options)
    .then((response) => convertHTTPResponseToREST(response, type, resource, params))
}
