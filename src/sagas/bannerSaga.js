import { call, put, all } from 'redux-saga/effects'
import * as types from '../actions'
import { bannersService } from '../services'
import { transformMeta } from 'utils/tableUtils'

function* getBanners({ params }) {
  try {
    const { meta, data } = yield call(bannersService.getBanners, params)

    const modifiedMeta = transformMeta(meta)

    yield put({
      type: types.GET_BANNERS_SUCCESS,
      response: data,
      modifiedMeta
    })
  } catch (error) {
    yield put({ type: types.GET_BANNERS_ERROR, payload: error })
  }
}

function* getBannerById({ id }) {
  try {
    const response = yield call(bannersService.getBannerById, id)
    yield put({ type: types.GET_BANNER_BY_ID_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_BANNER_BY_ID_ERROR, payload: error })
  }
}

function* postBanner({ data }) {
  try {
    yield call(bannersService.postBanner, data)
    yield put({
      type: types.POST_BANNER_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.POST_BANNER_ERROR, payload: error })
  }
}

function* putBanner({ id, data }) {
  try {
    yield call(bannersService.putBanner, id, data)
    yield put({
      type: types.PUT_BANNER_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.PUT_BANNER_ERROR, payload: error })
  }
}

function* deleteBanner({ id }) {
  try {
    yield call(bannersService.deleteBanner, id)
    yield put({
      type: types.DELETE_BANNER_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.DELETE_BANNER_ERROR, payload: error })
  }
}

function* deleteSelectedBanners({ ids }) {
  try {
    yield all(ids.map(id => call(bannersService.deleteBanner, id)))
    yield put({
      type: types.DELETE_SELECTED_BANNERS_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.DELETE_SELECTED_BANNERS_ERROR, payload: error })
  }
}

export default {
  getBanners,
  getBannerById,
  postBanner,
  putBanner,
  deleteBanner,
  deleteSelectedBanners
}
