import { call, put } from 'redux-saga/effects'

import * as types from '../actions'

import { designGalleryService } from '../services'

function* postDesignGallery(action) {
  try {
    const response = yield call(
      designGalleryService.postDesignGallery,
      action.data
    )
    yield put({
      type: types.POST_DESIGN_GALLERY_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.POST_DESIGN_GALLERY_ERROR,
      payload: error
    })
  }
}

function* putDesignGallery(action) {
  try {
    const response = yield call(designGalleryService.putDesignGallery, {
      id: action.meta.id,
      data: action.data
    })
    yield put({
      type: types.PUT_DESIGN_GALLERY_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.PUT_DESIGN_GALLERY_ERROR,
      payload: error
    })
  }
}

function* getDesignGallery(action) {
  try {
    const response = yield call(
      designGalleryService.getDesignGallery,
      action.data
    )
    yield put({
      type: types.GET_DESIGN_GALLERY_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.GET_DESIGN_GALLERY_ERROR,
      payload: error
    })
  }
}

// images

function* getPatterns(action) {
  const response = yield call(designGalleryService.getPatterns, action.data)

  yield put({
    type: types.GET_PATTERNS_SUCCESS,
    action,
    payload: response
  })
}

function* getShapes(action) {
  const response = yield call(designGalleryService.getShapes, action.data)
  yield put({
    type: types.GET_SHAPES_SUCCESS,
    action,
    payload: response
  })
}

function* getIcons(action) {
  const response = yield call(designGalleryService.getIcons, action.data)
  yield put({
    type: types.GET_ICONS_SUCCESS,
    action,
    payload: response
  })
}

function* getEmojis(action) {
  const response = yield call(designGalleryService.getEmojis, action.data)
  yield put({
    type: types.GET_EMOJIS_SUCCESS,
    action,
    payload: response
  })
}

function* getBackgroundImages(action) {
  try {
    const response = yield call(
      designGalleryService.getBackgroundImages,
      action.data
    )
    yield put({
      type: types.GET_BACKGROUND_IMAGES_SUCCESS,
      action,
      payload: {
        ...response,
        changeImages: action.data.changeImages
      }
    })
  } catch (error) {
    yield put({ type: types.GET_BACKGROUND_IMAGES_ERROR, payload: error })
  }
}

function* setSelectedBg(action) {
  yield put({
    type: types.SET_SELECTED_BG_SUCCESS,
    data: action.data
  })
}

function* getStockImages(action) {
  try {
    const response = yield call(
      designGalleryService.getStockImages,
      action.data
    )
    yield put({
      type: types.GET_STOCK_IMAGES_SUCCESS,
      action,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GET_STOCK_IMAGES_ERROR, payload: error })
  }
}

function* getDesigns(action) {
  const response = yield call(designGalleryService.getDesigns, action.data)

  yield put({
    type: types.GET_DESIGNS_SUCCESS,
    action,
    payload: response
  })
}

export default {
  postDesignGallery,
  putDesignGallery,
  getDesignGallery,

  // images
  getPatterns,
  getBackgroundImages,
  setSelectedBg,
  getShapes,
  getIcons,
  getEmojis,
  getStockImages,

  // designs
  getDesigns
}
