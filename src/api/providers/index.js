import api, { getImageUrl } from '..'

export const fetchAllChannelBylanguage = (lang) => {
  return api
    .post('/api/v5/channels', {
      language: lang,
    })
    .then(selectiveDataExtraction)
}

export const fetchAllQuickChannel = () => {
  return api.post('/api/v5/quick-channels').then(selectiveDataExtraction)
}

export const fetchAllLanguage = () => {
  return api.post('/api/v5/languages').then((data) => {
    return data.data.map((item) => {
      return {
        id: item.id,
        title: item.insert_language,
        poster: getImageUrl(item.image),
        background: getImageUrl(item.image, 'w1280'),
        stream_url: item.stream_url,
      }
    })
  })
}

export const sendOTP = ({ phone, email, device_name, mac_address, android_id, app_version }) => {
  return api
    .post('/api/v2/subscriber', {
      phone,
      email,
      device_name,
      mac_address,
      android_id,
      app_version,
    })
    .then((data) => {
      return data.data
    })
}

export const verifyOTP = ({ email, mac_address, password }) => {
  return api
    .post('/api/v2/validate-subscriber', {
      email,
      mac_address,
      password, // This is the OTP
    })
    .then((data) => {
      return data.data
    })
}

const selectiveDataExtraction = (data) => {
  let filteredItems = data.data.filter((r) => !r.adult)
  return filteredItems.map((item) => {
    return {
      poster: getImageUrl(item.image),
      background: getImageUrl(item.image, 'w1280'),
      identifier: item.id,
      title: item.channel_name || item.name,
      overview: item.categories,
      stream_url: item.stream_url,
    }
  })
}
