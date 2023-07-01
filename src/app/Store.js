/**
 * Checks if the response is OK (status in the range 200-299).
 * If not, it throws an error with the response message.
 * If the response is OK, it parses it as JSON.
 * @param {Response} response - The response object to check
 * @returns {Promise<any>} A promise that resolves with the response data
 */
const jsonOrThrowIfError = async (response) => {
  if(!response.ok) throw new Error((await response.json()).message)
  return response.json()
}
/**
 * Class representing an API.
 * This class includes methods for performing GET, POST, DELETE, and PATCH requests.
 */
class Api {
  constructor({baseUrl}) {
    this.baseUrl = baseUrl;
  }
  async get({url, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'GET'}))
  }
  async post({url, data, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'POST', body: data}))
  }
  async delete({url, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'DELETE'}))
  }
  async patch({url, data, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'PATCH', body: data}))
  }
}
/**
 * Builds headers for an HTTP request.
 * Adds 'Content-Type: application/json' and 'Authorization: Bearer {jwt}' if not specified otherwise.
 * @param {Object} headers - The headers to include in the request
 * @returns {Object} The headers for the request
 */
const getHeaders = (headers) => {
  const h = { }
  if (!headers.noContentType) h['Content-Type'] = 'application/json'
  const jwt = localStorage.getItem('jwt')
  if (jwt && !headers.noAuthorization) h['Authorization'] = `Bearer ${jwt}`
  return {...h, ...headers}
}
/**
 * Class representing an entity in the API.
 * This class includes methods for performing select, list, update, create, and delete operations on the entity.
 */
class ApiEntity {
  constructor({key, api}) {
    this.key = key;
    this.api = api;
  }
  async select({selector, headers = {}}) {
    return await (this.api.get({url: `/${this.key}/${selector}`, headers: getHeaders(headers)}))
  }
  async list({headers = {}} = {}) {
    return await (this.api.get({url: `/${this.key}`, headers: getHeaders(headers)}))
  }
  async update({data, selector, headers = {}}) {
    return await (this.api.patch({url: `/${this.key}/${selector}`, headers: getHeaders(headers), data}))
  }
  async create({data, headers = {}}) {
    return await (this.api.post({url: `/${this.key}`, headers: getHeaders(headers), data}))
  }
  async delete({selector, headers = {}}) {
    return await (this.api.delete({url: `/${this.key}/${selector}`, headers: getHeaders(headers)}))
  }
}


/**
 * Builds headers for an HTTP request.
 * Adds 'Content-Type: application/json' and 'Authorization: Bearer {jwt}' if not specified otherwise.
 * @param {Object} headers - The headers to include in the request
 * @returns {Object} The headers for the request
 */
class Store {
  constructor() {
    this.api = new Api({baseUrl: 'http://localhost:5678'})
  }

  user = uid => (new ApiEntity({key: 'users', api: this.api})).select({selector: uid})
  users = () => new ApiEntity({key: 'users', api: this.api})
  login = (data) => this.api.post({url: '/auth/login', data, headers: getHeaders({noAuthorization: true})})

  ref = (path) => this.store.doc(path)

  bill = bid => (new ApiEntity({key: 'bills', api: this.api})).select({selector: bid})
  bills = () => new ApiEntity({key: 'bills', api: this.api})
}

export default new Store()
