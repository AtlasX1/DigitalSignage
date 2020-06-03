import { call, put, all } from 'redux-saga/effects'
import * as types from '../actions'
import { contentsService } from '../services'
import { transformMeta } from 'utils/tableUtils'

function* getContentsByFeature({ feature, params }) {
  try {
    const { data, meta } = yield call(
      contentsService.getContentsByFeature,
      feature,
      params
    )

    const modifiedMeta = transformMeta(meta)

    yield put({
      type: types.GET_CONTENTS_BY_FEATURE_SUCCESS,
      key: feature,
      payload: data,
      modifiedMeta
    })
  } catch (error) {
    yield put({
      type: types.GET_CONTENTS_BY_FEATURE_ERROR,
      key: feature,
      payload: error
    })
  }
}

function* postContentIntoFeature({ feature, data }) {
  try {
    yield call(contentsService.postContentIntoFeature, feature, data)
    yield put({
      type: types.POST_CONTENT_INTO_FEATURE_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({
      type: types.POST_CONTENT_INTO_FEATURE_ERROR,
      payload: error
    })
  }
}

function* getContentById({ id }) {
  try {
    const response = yield call(contentsService.getContentById, id)
    yield put({
      type: types.GET_CONTENT_BY_ID_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.GET_CONTENT_BY_ID_ERROR,
      payload: error
    })
  }
}

function* putContent({ id, data }) {
  try {
    yield call(contentsService.putContent, id, data)
    yield put({
      type: types.PUT_CONTENT_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({
      type: types.PUT_CONTENT_ERROR,
      payload: error
    })
  }
}

function* deleteContent({ id }) {
  try {
    yield call(contentsService.deleteContent, id)
    yield put({
      type: types.DELETE_CONTENT_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({
      type: types.DELETE_CONTENT_ERROR,
      payload: error
    })
  }
}

function* deleteSelectedContent({ ids }) {
  try {
    yield all(ids.map(id => call(contentsService.deleteContent, id)))
    yield put({
      type: types.DELETE_SELECTED_CONTENT_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({
      type: types.DELETE_SELECTED_CONTENT_ERROR,
      payload: error
    })
  }
}

export default {
  getContentsByFeature,
  postContentIntoFeature,
  getContentById,
  putContent,
  deleteContent,
  deleteSelectedContent
}
