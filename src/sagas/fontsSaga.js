import { call, put } from 'redux-saga/effects'
import * as types from '../actions'
import { fontsService } from '../services'
import splitVariant from '../utils/fontUtils'

function* getGoogleFonts() {
  try {
    const response = yield call(fontsService.fetchFonts)

    const items = response.items.map(font => ({
      ...font,
      selected: false,
      variants: font.variants.map(variant => splitVariant(variant))
    }))

    yield put({
      type: types.GET_GOOGLE_FONTS_SUCCESS,
      items
    })
  } catch (error) {
    yield put({ type: types.GET_GOOGLE_FONTS_ERROR, error })
  }
}
function* getSavedFonts() {
  try {
    const response = yield call(fontsService.fetchFonts)
    const perPage = response.items.slice(0, 20).map(font => ({
      ...font,
      selected: false,
      variants: font.variants.map(variant => splitVariant(variant))
    }))
    const myFonts = response.items.map(font => ({
      ...font,
      selected: false,
      variants: font.variants.map(variant => splitVariant(variant))
    }))
    const downloadedFonts = response.items
      .slice(0, 20)
      .map(({ family, variants }) => `${family}:${variants.join(',')}`)
    const config = response.items
      .slice(0, 20)
      .map(({ family, variants }) => `${family}:${variants.join(',')}`)

    yield put({
      type: types.GET_SAVED_FONTS_SUCCESS,
      perPage,
      myFonts,
      downloadedFonts,
      config
    })
  } catch (error) {
    yield put({ type: types.GET_SAVED_FONTS_ERROR, error })
  }
}

function* getFonts() {
  try {
    const response = yield call(fontsService.getFonts)
    yield put({ type: types.GET_FONTS_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_FONTS_ERROR, payload: error })
  }
}

function* deleteFont(action) {
  try {
    const response = yield call(fontsService.deleteFont, action.payload)
    yield put({ type: types.DELETE_FONT_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.DELETE_FONT_ERROR, payload: error })
  }
}

function* postFont(action) {
  try {
    const response = yield call(fontsService.postFont, action.payload)
    yield put({ type: types.POST_FONT_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.POST_FONT_ERROR, payload: error })
  }
}

export default {
  getGoogleFonts,
  getSavedFonts,
  getFonts,
  deleteFont,
  postFont
}
