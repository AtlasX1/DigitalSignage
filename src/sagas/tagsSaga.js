import { call, put, all } from 'redux-saga/effects'

import * as types from '../actions'

import { tagsService } from '../services'
import { transformMeta } from 'utils/tableUtils'

function* getTags({ params }) {
  try {
    const { meta, data } = yield call(tagsService.getTags, params)

    //Set the end of the download
    const modifiedMeta = transformMeta(meta)

    yield put({
      type: types.GET_TAGS_SUCCESS,
      response: data,
      modifiedMeta
    })
  } catch (error) {
    yield put({ type: types.GET_TAGS_ERROR, payload: error })
  }
}

function* getTagById({ id }) {
  try {
    const response = yield call(tagsService.getTagById, id)
    yield put({ type: types.GET_TAG_BY_ID_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_TAG_BY_ID_ERROR, payload: error })
  }
}

function* postTag({ data }) {
  try {
    yield call(tagsService.postTag, data)
    yield put({ type: types.POST_TAG_SUCCESS, payload: { status: 'success' } })
  } catch (error) {
    yield put({ type: types.POST_TAG_ERROR, payload: error })
  }
}

function* putTag({ id, data }) {
  try {
    yield call(tagsService.putTag, id, data)
    yield put({
      type: types.PUT_TAG_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.PUT_TAG_ERROR, payload: error })
  }
}

function* deleteTag({ id }) {
  try {
    yield call(tagsService.deleteTag, id)
    yield put({
      type: types.DELETE_TAG_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.DELETE_TAG_ERROR, payload: error })
  }
}

function* deleteSelectedTags({ ids }) {
  try {
    yield all(ids.map(id => call(tagsService.deleteTag, id)))
    yield put({
      type: types.DELETE_SELECTED_TAGS_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.DELETE_SELECTED_TAGS_ERROR, payload: error })
  }
}

export default {
  getTags,
  getTagById,
  postTag,
  putTag,
  deleteTag,
  deleteSelectedTags
}
