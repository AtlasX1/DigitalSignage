import { call, put } from 'redux-saga/effects'

import * as types from '../actions'
import { signageEditorService } from '../services'

function* getPatterns(action) {
  const response = yield call(signageEditorService.getPatterns, action.data)
  yield put({
    type: types.GET_PATTERNS_SUCCESS,
    action,
    payload: response
  })
}

function* getShapes(action) {
  const response = yield call(signageEditorService.getShapes, action.data)
  yield put({
    type: types.GET_SHAPES_SUCCESS,
    action,
    payload: response
  })
}

function* getIcons(action) {
  const response = yield call(signageEditorService.getIcons, action.data)
  yield put({
    type: types.GET_ICONS_SUCCESS,
    action,
    payload: response
  })
}

function* getEmojis(action) {
  const response = yield call(signageEditorService.getEmojis, action.data)
  yield put({
    type: types.GET_EMOJIS_SUCCESS,
    action,
    payload: response
  })
}

function* getBackgroundImages(action) {
  try {
    const response = yield call(
      signageEditorService.getBackgroundImages,
      action.data
    )
    yield put({
      type: types.GET_BACKGROUND_IMAGES_SUCCESS,
      action,
      payload: response
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

function* getLibraryImages(action) {
  const response = yield call(
    signageEditorService.getLibraryImages,
    action.data
  )
  yield put({
    type: types.GET_LIBRARY_IMAGES_SUCCESS,
    action,
    payload: response
  })
}

function* getStockImages(action) {
  try {
    const response = yield call(
      signageEditorService.getStockImages,
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

function* getTemplates(action) {
  const response = yield call(signageEditorService.getTemplates, action.data)
  yield put({
    type: types.GET_TEMPLATES_SUCCESS,
    action,
    payload: response
  })
}

function* addTemplate(action) {
  const response = yield call(signageEditorService.addTemplate, action.data)
  yield put({
    type: types.ADD_TEMPLATE_SUCCESS,
    payload: response
  })
}

export default {
  getPatterns,
  getBackgroundImages,
  setSelectedBg,
  getShapes,
  getIcons,
  getEmojis,
  getLibraryImages,
  getStockImages,
  getTemplates,
  addTemplate
}
