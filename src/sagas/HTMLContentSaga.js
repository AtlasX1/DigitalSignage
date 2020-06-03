import { call, put, all } from 'redux-saga/effects'

import * as types from '../actions'

import { HTMLContentService } from '../services'
import { transformMeta } from 'utils/tableUtils'

function* getHTMLContents({ params }) {
  try {
    const { data, meta } = yield call(
      HTMLContentService.getHTMLContents,
      params
    )

    const modifiedMeta = transformMeta(meta)

    yield put({
      type: types.GET_HTML_CONTENTS_SUCCESS,
      response: data,
      modifiedMeta
    })
  } catch (error) {
    yield put({ type: types.GET_HTML_CONTENTS_ERROR, payload: error })
  }
}

function* postHTMLContent({ data }) {
  try {
    yield call(HTMLContentService.postHTMLContent, data)
    yield put({
      type: types.POST_HTML_CONTENT_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.POST_HTML_CONTENT_ERROR, payload: error })
  }
}

function* deleteHTMLContent({ id }) {
  try {
    yield call(HTMLContentService.deleteHTMLContent, id)
    yield put({
      type: types.DELETE_HTML_CONTENT_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.DELETE_HTML_CONTENT_ERROR, payload: error })
  }
}

function* getHTMLContent({ id }) {
  try {
    const response = yield call(HTMLContentService.getHTMLContent, id)
    yield put({ type: types.GET_HTML_CONTENT_BY_ID_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_HTML_CONTENT_BY_ID_ERROR, payload: error })
  }
}

function* putHTMLContent({ id, data }) {
  try {
    yield call(HTMLContentService.putHTMLContent, id, data)
    yield put({
      type: types.PUT_HTML_CONTENT_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.PUT_HTML_CONTENT_ERROR, payload: error })
  }
}

function* deleteSelectedHTMLContents({ ids }) {
  try {
    yield all(ids.map(id => call(HTMLContentService.deleteHTMLContent, id)))
    yield put({
      type: types.DELETE_SELECTED_HTML_CONTENTS_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({
      type: types.DELETE_SELECTED_HTML_CONTENTS_ERROR,
      payload: error
    })
  }
}

export default {
  deleteSelectedHTMLContents,
  getHTMLContents,
  postHTMLContent,
  deleteHTMLContent,
  getHTMLContent,
  putHTMLContent
}
