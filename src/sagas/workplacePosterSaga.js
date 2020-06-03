import { call, put, all } from 'redux-saga/effects'

import * as types from '../actions'

import { workplacePosterService } from '../services'
import { transformMeta } from 'utils/tableUtils'

function* getWorkplacePosters({ params }) {
  try {
    const { data, meta } = yield call(
      workplacePosterService.getWorkplacePosters,
      params
    )

    const modifiedMeta = transformMeta(meta)

    yield put({
      type: types.GET_WORKPLACE_POSTERS_SUCCESS,
      response: data,
      modifiedMeta
    })
  } catch (error) {
    yield put({ type: types.GET_WORKPLACE_POSTERS_ERROR, payload: error })
  }
}

function* postWorkplacePoster({ data }) {
  try {
    yield call(workplacePosterService.postWorkplacePoster, data)
    yield put({
      type: types.POST_WORKPLACE_POSTER_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.POST_WORKPLACE_POSTER_ERROR, payload: error })
  }
}

function* deleteWorkplacePoster({ id }) {
  try {
    yield call(workplacePosterService.deleteWorkplacePoster, id)
    yield put({
      type: types.DELETE_WORKPLACE_POSTER_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.DELETE_WORKPLACE_POSTER_ERROR, payload: error })
  }
}

function* deleteSelectedWorkplacePoster({ ids }) {
  try {
    yield all(
      ids.map(id => call(workplacePosterService.deleteWorkplacePoster, id))
    )
    yield put({
      type: types.DELETE_SELECTED_WORKPLACE_POSTERS_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({
      type: types.DELETE_SELECTED_WORKPLACE_POSTERS_ERROR,
      payload: error
    })
  }
}

function* getWorkplacePoster({ id }) {
  try {
    const response = yield call(workplacePosterService.getWorkplacePoster, id)
    yield put({ type: types.GET_WORKPLACE_POSTER_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_WORKPLACE_POSTER_ERROR, payload: error })
  }
}

function* putWorkplacePoster({ id, data }) {
  try {
    yield call(workplacePosterService.putWorkplacePoster, id, data)
    yield put({
      type: types.PUT_WORKPLACE_POSTER_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.PUT_WORKPLACE_POSTER_ERROR, payload: error })
  }
}

function* getWorkplacePosterTags({ params }) {
  try {
    const { data } = yield call(
      workplacePosterService.getWorkplacePostersTags,
      params
    )

    yield put({
      type: types.GET_WORKPLACE_POSTERS_TAGS_SUCCESS,
      response: data
    })
  } catch (error) {
    yield put({ type: types.GET_WORKPLACE_POSTERS_TAGS_ERROR, payload: error })
  }
}

function* postWorkplacePosterTag({ data }) {
  try {
    yield call(workplacePosterService.postWorkplacePosterTag, data)
    yield put({
      type: types.POST_WORKPLACE_POSTER_TAG_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.POST_WORKPLACE_POSTER_TAG_ERROR, payload: error })
  }
}

function* deleteWorkplacePosterTag({ id }) {
  try {
    yield call(workplacePosterService.deleteWorkplacePosterTag, id)
    yield put({
      type: types.DELETE_WORKPLACE_POSTER_TAG_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.DELETE_WORKPLACE_POSTER_TAG_ERROR, payload: error })
  }
}

export default {
  getWorkplacePosters,
  postWorkplacePoster,
  deleteWorkplacePoster,
  getWorkplacePoster,
  putWorkplacePoster,
  getWorkplacePosterTags,
  postWorkplacePosterTag,
  deleteWorkplacePosterTag,
  deleteSelectedWorkplacePoster
}
