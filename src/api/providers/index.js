import api, { getImageUrl } from '..'

export const fetchAllChannelBylanguage = (lang) => {
  return api
    .post('/api/v2/channels', {
      language: lang,
    })
    .then(selectiveDataExtraction)
}

export const fetchAllLanguage = () => {
  return api.post('/api/v2/languages').then((data) => {
    return data.data.map((item) => {
      return {
        id: item.id,
        title: item.insert_language,
        poster: getImageUrl(item.image),
        background: getImageUrl(item.image, 'w1280'),
      }
    })
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
      overview: item.overview,
    }
  })
}
