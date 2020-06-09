import * as types from './index'

const postDesignGallery = ({ data }) => ({
  type: types.POST_DESIGN_GALLERY,
  data
})

const putDesignGallery = ({ id, data }) => ({
  type: types.PUT_DESIGN_GALLERY,
  data,
  meta: {
    id
  }
})

const getDesignGallery = id => ({
  type: types.GET_DESIGN_GALLERY,
  data: id
})

const clearDesignGallery = meta => ({
  type: types.CLEAR_DESIGN_GALLERY,
  meta
})

// images

const getPatterns = ({
  query,
  patternsPage,
  perPage,
  changeImages = false
}) => ({
  type: types.GET_PATTERNS,
  data: { query, patternsPage, perPage, changeImages }
})

const getShapes = ({ query, shapesPage, perPage }) => ({
  type: types.GET_SHAPES,
  data: { query, shapesPage, perPage }
})

const getIcons = ({ query, iconsPage, perPage }) => ({
  type: types.GET_ICONS,
  data: { query, iconsPage, perPage }
})

const getEmojis = ({ query, emojisPage, perPage }) => ({
  type: types.GET_EMOJIS,
  data: { query, emojisPage, perPage }
})

const getBackgroundImages = ({
  query,
  photosPage,
  perPage,
  changeImages = false
}) => ({
  type: types.GET_BACKGROUND_IMAGES,
  data: { query, photosPage, perPage, changeImages }
})

const setSelectedBg = id => ({
  type: types.SET_SELECTED_BG,
  data: { id }
})

const removeSelectedBg = () => ({
  type: types.REMOVE_SELECTED_BG_SUCCESS
})

const getStockImages = ({ query, stockImagesPage, perPage }) => ({
  type: types.GET_STOCK_IMAGES,
  data: { query, stockImagesPage, perPage }
})

const getDesigns = data => ({
  type: types.GET_DESIGNS,
  data
})

const setOpenLeftSidebar = data => ({
  type: types.SET_OPEN_LEFT_SIDEBAR,
  data
})

const setOpenRightSidebar = data => ({
  type: types.SET_OPEN_RIGHT_SIDEBAR,
  data
})

export {
  postDesignGallery,
  putDesignGallery,
  getDesignGallery,
  clearDesignGallery,
  setOpenLeftSidebar,
  setOpenRightSidebar,
  // images
  getPatterns,
  getShapes,
  getIcons,
  getEmojis,
  getBackgroundImages,
  setSelectedBg,
  removeSelectedBg,
  getStockImages,
  // designs
  getDesigns
}
