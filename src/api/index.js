const BEARER_TOKEN = import.meta.env.VITE_TOKEN
const API_BASE = import.meta.env.VITE_BASE_URL

let config
let baseImageUrl
const basePosterSize = 'w185'

const defaultFetchParams = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + BEARER_TOKEN,
  },
}

export function getImageUrl(path, posterSize = basePosterSize) {
  // Fallback base URL if config not loaded
  const fallbackBaseUrl = 'https://quickfox.s3.us-west-002.backblazeb2.com/top-tv/channels/'

  // If full URL is already in the path, just return it
  if (path?.startsWith('http')) return path

  // Use baseImageUrl if available, otherwise fallback
  const baseUrl = baseImageUrl || fallbackBaseUrl

  return baseUrl + (posterSize || '') + path
}

function get(...args) {
  if (config) {
    return _get(...args)
  } else {
    return loadConfig().then(() => _get(...args))
  }
}

function _get(path, params = {}) {
  return fetch(API_BASE + path, {
    ...defaultFetchParams,
    ...params,
  }).then((r) => r.json())
}

function post(path, body = {}, params = {}) {
  return fetch(API_BASE + path, {
    method: 'POST',
    ...defaultFetchParams,
    body: JSON.stringify(body),
    ...params,
  }).then((r) => r.json())
}

function loadConfig() {
  return _get('/configuration').then((data) => {
    config = data
    baseImageUrl = data.images.secure_base_url
    return data
  })
}

export default {
  get,
  post,
  loadConfig,
}
