import { concat as _concat } from 'lodash'
import * as types from '../../actions'
import { TABS_NAMES } from '../../components/Pages/DesignGallery/constans'

const initialState = {
  patterns: [],
  patternsPage: 0,
  photos: [],
  photosPage: 0,
  shapes: [],
  shapesPage: 0,
  icons: [],
  iconsPage: 0,
  emojis: [],
  emojisPage: 0,
  fonts: [],
  fontsPage: 0,
  stockImages: [],
  stockImagesPage: 1,
  libraryImages: [],
  libraryImagesPage: 0,
  templates: [],
  templatesPage: 0,
  templatesFilter: 'all',
  shapesTabQuery: '',
  backgroundsTabQuery: '',
  fontsTabQuery: '',
  imagesTabQuery: '',
  templatesTabQuery: '',
  perPage: 40,
  isFetching: false
}

const setPreviousPage = (payload = [], page) => {
  return !payload.length ? page - 1 : page
}

const setSelectedById = (array, id) => {
  return array.map(el => ({ ...el, selected: el.id === id }))
}
export default (state = initialState, { action, data = {}, type, payload }) => {
  switch (type) {
    // PATTERNS
    case types.GET_PATTERNS:
      return {
        ...state,
        backgroundsTabQuery: data.query,
        patternsPage: data.patternsPage,
        perPage: data.perPage,
        isFetching: true
      }
    case types.GET_PATTERNS_SUCCESS:
      const patterns = !state.patternsPage
        ? payload
        : _concat(state.patterns, payload)
      return {
        ...state,
        patterns,
        isFetching: false
      }

    // SHAPES
    case types.GET_SHAPES:
      return {
        ...state,
        shapesTabQuery: data.query,
        shapesPage: data.shapesPage,
        perPage: data.perPage,
        isFetching: true
      }
    case types.GET_SHAPES_SUCCESS:
      const shapes = !state.shapesPage
        ? payload
        : _concat(state.shapes, payload)
      return {
        ...state,
        shapes,
        isFetching: false
      }

    // ICONS
    case types.GET_ICONS:
      return {
        ...state,
        shapesTabQuery: data.query,
        iconsPage: data.iconsPage,
        perPage: data.perPage,
        isFetching: true
      }
    case types.GET_ICONS_SUCCESS:
      const icons = !state.iconsPage ? payload : _concat(state.icons, payload)
      return {
        ...state,
        icons,
        isFetching: false
      }

    // EMOJIS
    case types.GET_EMOJIS:
      return {
        ...state,
        shapesTabQuery: data.query,
        emojisPage: data.emojisPage,
        perPage: data.perPage,
        isFetching: true
      }
    case types.GET_EMOJIS_SUCCESS:
      const emojis = !state.emojisPage
        ? payload
        : _concat(state.emojis, payload)
      return {
        ...state,
        emojis,
        isFetching: false
      }

    // FONTS
    case types.GET_FONTS:
      return {
        ...state,
        fontsTabQuery: data.query,
        fontsPage: data.fontsPage,
        perPage: data.perPage,
        isFetching: true
      }
    case types.GET_FONTS_SUCCESS:
      const fonts = !state.fontsPage ? payload : _concat(state.fonts, payload)
      return {
        ...state,
        fonts,
        isFetching: false
      }

    // TEMPLATES
    case types.ADD_TEMPLATE_SUCCESS:
      return {
        ...state,
        templates: _concat(state.templates, payload)
      }
    case types.GET_TEMPLATES:
      return {
        ...state,
        templatesFilter: data.filter,
        templatesTabQuery: data.query,
        templatesPage: data.templatesPage,
        perPage: data.perPage,
        isFetching: true
      }
    case types.GET_TEMPLATES_SUCCESS:
      const templates = !state.templatesPage
        ? payload
        : _concat(state.templates, payload)
      return {
        ...state,
        templatesPage: setPreviousPage(payload, action.data.templatesPage),
        templates,
        isFetching: false
      }

    // BACKGROUND IMAGES
    case types.GET_BACKGROUND_IMAGES:
      return {
        ...state,
        backgroundsTabQuery: data.query,
        photosPage: data.photosPage,
        perPage: data.perPage,
        isFetching: true
      }
    case types.GET_BACKGROUND_IMAGES_SUCCESS:
      const images = payload.photos.map(el => ({
        ...el,
        type: TABS_NAMES.background,
        selected: false,
        showAs: 'bg',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }))
      const photos = !state.photosPage ? images : _concat(state.photos, images)
      return {
        ...state,
        photos,
        isFetching: false
      }
    case types.GET_BACKGROUND_IMAGES_ERROR:
      return {
        ...state,
        isFetching: false
      }

    // STOCK IMAGES
    case types.GET_STOCK_IMAGES:
      return {
        ...state,
        imagesTabQuery: data.query,
        stockImagesPage: data.stockImagesPage,
        perPage: data.perPage,
        isFetching: true
      }
    case types.GET_STOCK_IMAGES_SUCCESS:
      const stockImagesNormalize = payload.hits.map(el => ({
        ...el,
        src: {
          small: el.webformatURL,
          original: el.largeImageURL || el.imageURL
        },
        type: TABS_NAMES.stockImages,
        showAs: 'image'
      }))
      const stockImages = !(state.stockImagesPage - 1)
        ? stockImagesNormalize
        : _concat(state.stockImages, stockImagesNormalize)
      return {
        ...state,
        stockImages,
        isFetching: false
      }
    case types.GET_STOCK_IMAGES_ERROR:
      return {
        ...state,
        isFetching: false
      }

    // LIBRARY IMAGES
    case types.GET_LIBRARY_IMAGES:
      return {
        ...state,
        imagesTabQuery: data.query,
        libraryImagesPage: data.libraryImagesPage,
        perPage: data.perPage,
        isFetching: true
      }
    case types.GET_LIBRARY_IMAGES_SUCCESS:
      const libraryImages = !state.libraryImagesPage
        ? payload
        : _concat(state.libraryImages, payload)
      return {
        ...state,
        libraryImages,
        isFetching: false
      }

    // SELECTED BG
    case types.SET_SELECTED_BG_SUCCESS:
      return {
        ...state,
        photos: setSelectedById(state.photos, data.id),
        patterns: setSelectedById(state.patterns, data.id)
      }
    default:
      return state
  }
}
