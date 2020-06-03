import { call, put } from 'redux-saga/effects'

import * as types from '../actions'

import { scheduleService } from '../services'
import { transformMeta } from 'utils/tableUtils'

function* getItems({ params }) {
  try {
    const { data, meta } = yield call(scheduleService.getItems, params)
    const modifiedMeta = transformMeta(meta)

    yield put({
      type: types.GET_SCHEDULE_ITEMS_SUCCESS,
      response: data,
      modifiedMeta
    })
  } catch (error) {
    yield put({ type: types.GET_SCHEDULE_ITEMS_ERROR, payload: error })
  }
}

function* getPreference() {
  try {
    const response = yield call(scheduleService.getPreference)
    yield put({
      type: types.GET_SCHEDULE_PREFERENCE_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GET_SCHEDULE_PREFERENCE_ERROR, payload: error })
  }
}

function* putPreference(action) {
  try {
    yield call(scheduleService.putPreference, action.payload)
    yield put({ type: types.GET_SCHEDULE_PREFERENCE })
  } catch (error) {
    yield put({ type: types.PUT_SCHEDULE_PREFERENCE_ERROR, payload: error })
  }
}

function* getGroups() {
  try {
    const response = yield call(scheduleService.getGroups)
    yield put({ type: types.GET_SCHEDULE_GROUPS_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_SCHEDULE_GROUPS_ERROR, payload: error })
  }
}

function* getGroupItems(action) {
  try {
    const response = yield call(scheduleService.getGroupItems, action.payload)
    yield put({
      type: types.GET_SCHEDULE_GROUP_ITEMS_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GET_SCHEDULE_GROUP_ITEMS_ERROR, payload: error })
  }
}

function* postGroupItem(action) {
  try {
    const response = yield call(scheduleService.postGroupItem, action.payload)
    yield put({
      type: types.POST_SCHEDULE_GROUP_ITEM_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.POST_SCHEDULE_GROUP_ITEM_ERROR, payload: error })
  }
}

function* deleteGroupItem(action) {
  try {
    const response = yield call(scheduleService.deleteGroupItem, action.payload)
    yield put({
      type: types.DELETE_SCHEDULE_GROUP_ITEM_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.DELETE_SCHEDULE_GROUP_ITEM_ERROR, payload: error })
  }
}

function* cloneSchedule({ data }) {
  try {
    yield call(scheduleService.cloneSchedule, data)
    yield put({
      type: types.CLONE_SCHEDULE_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.CLONE_SCHEDULE_ERROR, payload: error })
  }
}

function* deleteSelectedSchedules({ ids }) {
  try {
    yield call(scheduleService.deleteSelectedSchedules, ids)
    yield put({
      type: types.DELETE_SELECTED_SCHEDULES_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({
      type: types.DELETE_SELECTED_SCHEDULES_ERROR,
      payload: error
    })
  }
}

function* deleteScheduleById({ id }) {
  try {
    yield call(scheduleService.deleteScheduleById, id)
    yield put({
      type: types.DELETE_SCHEDULE_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({
      type: types.DELETE_SCHEDULE_ERROR,
      payload: error
    })
  }
}

export default {
  getItems,
  getPreference,
  putPreference,
  getGroups,
  getGroupItems,
  postGroupItem,
  deleteGroupItem,
  cloneSchedule,
  deleteSelectedSchedules,
  deleteScheduleById
}
