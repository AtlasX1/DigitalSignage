import * as types from './index'

export const getPatterns = ({ query, patternsPage, perPage }) => ({
  type: types.GET_PATTERNS,
  data: { query, patternsPage, perPage }
})

export const getShapes = ({ query, shapesPage, perPage }) => ({
  type: types.GET_SHAPES,
  data: { query, shapesPage, perPage }
})

export const getIcons = ({ query, iconsPage, perPage }) => ({
  type: types.GET_ICONS,
  data: { query, iconsPage, perPage }
})

export const getEmojis = ({ query, emojisPage, perPage }) => ({
  type: types.GET_EMOJIS,
  data: { query, emojisPage, perPage }
})

export const getBackgroundImages = ({ query, photosPage, perPage }) => ({
  type: types.GET_BACKGROUND_IMAGES,
  data: { query, photosPage, perPage }
})

export const setSelectedBg = id => ({
  type: types.SET_SELECTED_BG,
  data: { id }
})

export const getLibraryImages = ({ query, libraryImagesPage, perPage }) => ({
  type: types.GET_LIBRARY_IMAGES,
  data: { query, libraryImagesPage, perPage }
})

export const getStockImages = ({ query, stockImagesPage, perPage }) => ({
  type: types.GET_STOCK_IMAGES,
  data: { query, stockImagesPage, perPage }
})

export const addTemplate = data => ({
  type: types.ADD_TEMPLATE,
  data
})

export const getTemplates = data => ({
  type: types.GET_TEMPLATES,
  data
})

export const setOpenLeftSidebar = data => ({
  type: types.SET_OPEN_LEFT_SIDEBAR,
  data
})
