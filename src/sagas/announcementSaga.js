import { call, put, all } from 'redux-saga/effects'

import * as types from '../actions'

import { announcementService } from '../services'
import { transformMeta } from 'utils/tableUtils'

function* getAnnouncements({ params }) {
  try {
    const { data, meta } = yield call(
      announcementService.getAnnouncements,
      params
    )

    const modifiedMeta = transformMeta(meta)

    yield put({
      type: types.GET_ANNOUNCEMENTS_SUCCESS,
      response: data,
      modifiedMeta
    })
  } catch (error) {
    yield put({ type: types.GET_ANNOUNCEMENTS_ERROR, payload: error })
  }
}

function* postAnnouncement({ data }) {
  try {
    yield call(announcementService.postAnnouncement, data)
    yield put({
      type: types.POST_ANNOUNCEMENT_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.POST_ANNOUNCEMENT_ERROR, payload: error })
  }
}

function* deleteAnnouncement({ id }) {
  try {
    yield call(announcementService.deleteAnnouncement, id)
    yield put({
      type: types.DELETE_ANNOUNCEMENT_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.DELETE_ANNOUNCEMENT_ERROR, payload: error })
  }
}

function* getAnnouncement({ id }) {
  try {
    const response = yield call(announcementService.getAnnouncement, id)
    yield put({ type: types.GET_ANNOUNCEMENT_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_ANNOUNCEMENT_ERROR, payload: error })
  }
}

function* putAnnouncement({ id, data }) {
  try {
    yield call(announcementService.putAnnouncement, id, data)
    yield put({
      type: types.PUT_ANNOUNCEMENT_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.PUT_ANNOUNCEMENT_ERROR, payload: error })
  }
}

function* deleteSelectedAnnouncements({ ids }) {
  try {
    yield all(ids.map(id => call(announcementService.deleteAnnouncement, id)))
    yield put({
      type: types.DELETE_SELECTED_ANNOUNCEMENTS_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({
      type: types.DELETE_SELECTED_ANNOUNCEMENTS_ERROR,
      payload: error
    })
  }
}

export default {
  deleteSelectedAnnouncements,
  getAnnouncements,
  postAnnouncement,
  deleteAnnouncement,
  getAnnouncement,
  putAnnouncement
}
