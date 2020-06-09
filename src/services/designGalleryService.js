import api from './api'

import { errorHandler } from '../utils'

import { uniqueId as _uniqueId } from 'lodash'

import { TABS_NAMES } from '../components/Pages/DesignGallery/constans'
import mockShapes from '../components/Pages/DesignGallery/mockData/shapes'
import mockTemplates from '../components/Pages/DesignGallery/mockData/templates'
import axios from 'axios'
import {
  PEXEL_API_KEY,
  PEXEL_API_URL,
  PIXABAY_API_KEY,
  PIXABAY_API_URL
} from '../config'

//TODO: This is mock URLs,need to change on real once it will be ready on BE

const postDesignGallery = async data => {
  try {
    const response = await api({
      method: 'POST',
      url: '/design-gallery',
      data
    })

    return response
  } catch (e) {
    throw errorHandler(e)
  }
}

const putDesignGallery = async ({ id, data }) => {
  try {
    const response = await api({
      method: 'PUT',
      url: `/design-gallery/${id}`,
      data
    })

    return response
  } catch (e) {
    throw errorHandler(e)
  }
}

const getDesignGallery = async id => {
  try {
    const response = await api({
      method: 'GET',
      url: `/design-gallery/${id}`
    })

    return response.data
  } catch (e) {
    throw errorHandler(e)
  }
}

// images

const importAll = r => r.keys().map(r)
const requirePatterns = require.context(
  '../common/assets/patterns/',
  false,
  /.(png|jpe?g|JPE?G|svg)$/
)
const patternsNames = requirePatterns.keys()

// const requireLibraryImages = require.context(
//   '../common/assets/uploads/',
//   false,
//   /.(png|jpe?g|JPE?G|svg)$/
// )
// const libraryImagesNames = requireLibraryImages.keys()

//todo: fix when BE will be ready
const getPatterns = async ({ query, patternsPage, perPage, changeImages }) => {
  const currentPage = patternsPage > 0 ? patternsPage * perPage : patternsPage

  // try {
  //   const response = await api({
  //     method: 'GET',
  //     url: '/config/designGallery/pattern'
  //   })
  //
  //   return response.data.data.map(item => ({
  //     id: item.id,
  //     name: item.name,
  //     src: { small: item.thumb, original: item.content },
  //     type: TABS_NAMES.patterns,
  //     selected: false,
  //     showAs: 'bg'
  //   }))
  // } catch (e) {
  //   errorHandler(e)
  // }

  const length = importAll(requirePatterns).length
  const foundedPatterns = importAll(requirePatterns)
    .map((el, key) => ({
      id: _uniqueId(),
      name: patternsNames[key].substr(2),
      src: { small: el },
      type: TABS_NAMES.patterns,
      selected: false,
      showAs: 'bg'
    }))
    .filter(({ name }) => {
      return !query.length ? true : name.toLowerCase().includes(query)
    })
    .slice(currentPage, currentPage + perPage)

  return {
    patterns: foundedPatterns,
    patterns_total: length,
    changeImages
  }
}

const getBackgroundImages = async ({ query, photosPage, perPage }) => {
  // todo: separate v3dev BG and pixel's BG

  // try {
  //   const response = await api({
  //     method: 'GET',
  //     url: '/config/designGallery/background'
  //   })
  //
  //   return response.data.data.map(item => ({
  //     id: item.id,
  //     name: item.name,
  //     src: { small: item.thumb, original: item.content },
  //     type: TABS_NAMES.patterns,
  //     selected: false,
  //     showAs: 'bg'
  //   }))
  // } catch (e) {
  //   errorHandler(e)
  // }

  try {
    const response = await api({
      method: 'GET',
      url: `${PEXEL_API_URL}/v1/search?query=${query}&per_page=${perPage}&page=${photosPage}`,
      headers: {
        Authorization: PEXEL_API_KEY
      }
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getShapes = async ({ query, shapesPage, perPage }) => {
  // try {
  //   const response = await api({
  //     method: 'GET',
  //     url: '/config/designGallery/shapes'
  //   })
  //
  //   return response.data.data.map(item => ({
  //     id: item.id,
  //     name: item.name,
  //     src: { small: item.thumb, original: item.content },
  //     type: TABS_NAMES.shapes,
  //     selected: false,
  //     showAs: 'svg'
  //   }))
  // } catch (e) {
  //   errorHandler(e)
  // }

  const requireShapes = require.context(
    '../common/assets/shapes/',
    true,
    /.(svg)$/
  )
  const importedShapes = importAll(requireShapes)

  const currentPage = shapesPage > 0 ? shapesPage * perPage : shapesPage
  const shapesResult = mockShapes
    .filter(({ element_name }) => {
      return !query.length ? true : element_name.toLowerCase().includes(query)
    })
    .map((el, key) => ({
      id: _uniqueId(),
      name: el.element_name,
      src: {
        small: importedShapes.find(s => s.includes(el.element_name))
      },
      type: TABS_NAMES.shapes,
      showAs: 'svg',
      selected: false
    }))
    .slice(currentPage, currentPage + perPage)

  return shapesResult
}

const getIcons = async ({ query, iconsPage, perPage }) => {
  // try {
  //   const response = await api({
  //     method: 'GET',
  //     url: `/config/designGallery/icon/${style}`
  //   })
  //
  //   return response.data.data.map(item => ({
  //     id: item.id,
  //     name: item.name,
  //     src: { small: item.thumb, original: item.content },
  //     type: TABS_NAMES.emojis,
  //     selected: false,
  //     showAs: 'svg'
  //   }))
  // } catch (e) {
  //   errorHandler(e)
  // }

  const requireIcons = require.context(
    '../common/assets/icons/',
    true,
    /.(svg)$/
  )
  const importedIcons = importAll(requireIcons)
  const iconNames = requireIcons.keys()

  const currentPage = iconsPage > 0 ? iconsPage * perPage : iconsPage
  const iconsResult = importedIcons
    .map((el, key) => ({
      id: _uniqueId(),
      name: iconNames[key].substr(2),
      src: { small: el },
      type: TABS_NAMES.emojis,
      showAs: 'svg',
      selected: false
    }))
    .filter(({ name }) => {
      return !query.length ? true : name.toLowerCase().includes(query)
    })
    .slice(currentPage, currentPage + perPage)

  return iconsResult
}

const getEmojis = async ({ query, emojisPage, perPage }) => {
  // try {
  //   const response = await api({
  //     method: 'GET',
  //     url: '/config/designGallery/emojis'
  //   })
  //
  //   return response.data.data.map(item => ({
  //     id: item.id,
  //     name: item.name,
  //     src: { small: item.thumb, original: item.content },
  //     type: TABS_NAMES.emojis,
  //     selected: false,
  //     showAs: 'scg'
  //   }))
  // } catch (e) {
  //   errorHandler(e)
  // }

  const requireEmojis = require.context(
    '../common/assets/emojis/',
    true,
    /.(svg)$/
  )
  const importedEmojis = importAll(requireEmojis)
  const emojiNames = requireEmojis.keys()

  const currentPage = emojisPage > 0 ? emojisPage * perPage : emojisPage
  const emojisResult = importedEmojis
    .map((el, key) => ({
      id: _uniqueId(),
      name: emojiNames[key].substr(2),
      src: { small: el },
      type: TABS_NAMES.emojis,
      showAs: 'svg',
      selected: false
    }))
    .filter(({ name }) => {
      return !query.length ? true : name.toLowerCase().includes(query)
    })
    .slice(currentPage, currentPage + perPage)

  return emojisResult
}

const getStockImages = async ({ query, stockImagesPage, perPage }) => {
  try {
    //have to make an axios query to avoid CORS problems
    const response = await axios.get(
      `${PIXABAY_API_URL}?key=${PIXABAY_API_KEY}&q=${query}&lang=en&per_page=${perPage}&safesearch=true&page=${stockImagesPage}`
    )
    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

const getDesigns = ({ filter, query, designsPage, perPage }) => {
  // try {
  //   const response = await api({
  //     method: 'GET',
  //     url: '/config/designGallery/design'
  //   })
  //
  //   return response
  // } catch (e) {
  //   errorHandler(e)
  // }

  const currentPage = designsPage > 0 ? designsPage * perPage : designsPage

  const designsResult = mockTemplates
    .filter(({ group }) => {
      if (!filter || filter === 'all') return true
      return group === filter
    })
    .filter(({ title, tags }) => {
      const titleExist = title && title.toLowerCase().includes(query)
      const tagsExist = tags && tags.toLowerCase().includes(query)
      return !query.length || titleExist || tagsExist
    })
    .slice(currentPage, currentPage + perPage)

  return designsResult
}

export default {
  postDesignGallery,
  putDesignGallery,
  getDesignGallery,

  // images
  getPatterns,
  getBackgroundImages,
  getShapes,
  getIcons,
  getEmojis,
  getStockImages,

  // designs
  getDesigns
}
