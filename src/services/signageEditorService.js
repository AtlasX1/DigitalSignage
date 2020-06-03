import api from './api'
import { uniqueId as _uniqueId } from 'lodash'
import { errorHandler } from '../utils'
import { TABS_NAMES } from '../components/Pages/DesignGallery/constans'
import mockShapes from '../components/Pages/DesignGallery/mockData/shapes'
import mockTemlates from '../components/Pages/DesignGallery/mockData/templates'
import axios from 'axios'
import {
  PEXEL_API_KEY,
  PEXEL_API_URL,
  PIXABAY_API_KEY,
  PIXABAY_API_URL
} from '../config'

const importAll = r => r.keys().map(r)
const requirePatterns = require.context(
  '../common/assets/patterns/',
  false,
  /.(png|jpe?g|JPE?G|svg)$/
)
const patternsNames = requirePatterns.keys()

const requireLibraryImages = require.context(
  '../common/assets/uploads/',
  false,
  /.(png|jpe?g|JPE?G|svg)$/
)
const libraryImagesNames = requireLibraryImages.keys()

const getPatterns = ({ query, patternsPage, perPage }) => {
  const currentPage = patternsPage > 0 ? patternsPage * perPage : patternsPage
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
  return foundedPatterns
}

const getBackgroundImages = async ({ query, photosPage, perPage }) => {
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

const getLibraryImages = ({ query, libraryImagesPage, perPage }) => {
  const currentPage =
    libraryImagesPage > 0 ? libraryImagesPage * perPage : libraryImagesPage
  const foundedImages = importAll(requireLibraryImages)
    .map((el, key) => ({
      id: _uniqueId(),
      name: libraryImagesNames[key].substr(2),
      src: { original: el },
      type: TABS_NAMES.libraryImages,
      showAs: 'image'
    }))
    .filter(({ name }) => {
      return !query.length ? true : name.toLowerCase().includes(query)
    })
    .slice(currentPage, currentPage + perPage)
  return foundedImages
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

const getTemplates = ({ filter, query, templatesPage, perPage }) => {
  const currentPage =
    templatesPage > 0 ? templatesPage * perPage : templatesPage
  const shapesResult = mockTemlates
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

  return shapesResult
}

const addTemplate = data => {
  const { canvas, title, preview, tags } = data

  return {
    id: _uniqueId(),
    canvas,
    name: title,
    tags,
    src: {
      small: preview
    },
    type: TABS_NAMES.templates,
    showAs: 'template',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    selected: false
  }
}

export default {
  getPatterns,
  getBackgroundImages,
  getShapes,
  getIcons,
  getEmojis,
  getLibraryImages,
  getStockImages,
  getTemplates,
  addTemplate
}
