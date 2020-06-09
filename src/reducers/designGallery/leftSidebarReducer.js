import { concat as _concat } from 'lodash'
import * as types from '../../actions'
import { TABS_NAMES } from '../../components/Pages/DesignGallery/constans'

const initialState = {
  patterns: [],
  patternsPage: 0,
  patterns_total: 0,
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
  designs: [],
  designsPage: 0,
  designsFilter: 'all',
  shapesTabQuery: '',
  backgroundsTabQuery: '',
  fontsTabQuery: '',
  imagesTabQuery: '',
  designsTabQuery: '',
  perPage: 40,
  isFetching: false,
  total_results: 0
}

// const setPreviousPage = (payload = [], page) => {
//   return !payload.length ? page - 1 : page
// }

const setSelectedById = (array, id) => {
  return array.map(el => ({ ...el, selected: id ? el.id === id : false }))
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
      const patterns =
        !state.patternsPage || payload.changeImages
          ? payload.patterns
          : _concat(state.patterns, payload.patterns)
      return {
        ...state,
        patterns,
        patterns_total: payload.patterns_total,
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

    // DESIGNS
    case types.GET_DESIGNS:
      return {
        ...state,
        designsFilter: data.filter,
        designsTabQuery: data.query,
        designsPage: data.designsPage,
        perPage: data.perPage,
        isFetching: true
      }
    case types.GET_DESIGNS_SUCCESS:
      const designs = payload
      return {
        ...state,
        // designsPage: setPreviousPage(payload, action.data.designsPage),
        designs,
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
      const photos =
        !state.photosPage || payload.changeImages
          ? images
          : _concat(state.photos, images)
      return {
        ...state,
        photos,
        total_results: payload.total_results,
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

    case types.REMOVE_SELECTED_BG_SUCCESS:
      return {
        ...state,
        photos: setSelectedById(state.photos, false),
        patterns: setSelectedById(state.patterns, false)
      }

    default:
      return state
  }
}
