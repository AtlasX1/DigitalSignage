import { call, put } from 'redux-saga/effects'

import { dashboardService } from '../services'

import * as types from '../actions'

function* getInfo() {
  try {
    const response = yield call(dashboardService.getInfo)
    yield put({ type: types.GET_DASHBOARD_INFO_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_DASHBOARD_INFO_ERROR, payload: error })
  }
}

function* putInfo(action) {
  try {
    const response = yield call(dashboardService.putInfo, action.payload)
    yield put({ type: types.PUT_DASHBOARD_INFO_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.PUT_DASHBOARD_INFO_ERROR, payload: error })
  }
}

export default {
  getInfo,
  putInfo
}
