import api, { getImageUrl } from '..'

export const fetchAllChannelBylanguage = (lang) => {
  return api
    .post('/api/v5/channels', {
      language: lang,
    })
    .then(selectiveDataExtraction)
}

export const fetchAllChannel = () => {
  return api.post('/api/v4/all-channels-new').then((data) => {
    const categorized = data.data || {}
    const result = {}

    Object.entries(categorized).forEach(([category, items]) => {
      result[category] = (items || [])
        .filter((item) => !item.adult)
        .map((item) => ({
          poster: getImageUrl(item.image),
          background: getImageUrl(item.image, 'w1280'),
          identifier: item.id,
          title: item.channel_name || item.name,
          overview: item.categories,
          stream_url: item.stream_url,
        }))
    })

    return result
  })
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

export const sendOTP = ({ email, device_name, mac_address, android_id, app_version }) => {
  return api
    .post(
      '/api/v2/subscriber',
      {
        email,
        device_name,
        mac_address,
        android_id,
        app_version,
      },
      {},
      true
    )
    .then((data) => {
      if (data && data.success) {
        return data
      } else {
        throw new Error('OTP send failed: ' + (data?.message || 'Unknown error'))
      }
    })
}

export const verifyOTP = ({ email, mac_address, password }) => {
  return api
    .post(
      '/api/v2/validate-subscriber',
      {
        email,
        mac_address,
        password,
      },
      {},
      true
    )
    .then((data) => {
      return data
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
