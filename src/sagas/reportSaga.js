import { call, put } from 'redux-saga/effects'

import * as types from '../actions'

import { reportService } from '../services'
import { transformMeta } from 'utils/tableUtils'

function* getItems({ params }) {
  try {
    const { data, meta } = yield call(reportService.getItems, params)
    const modifiedMeta = transformMeta(meta)

    yield put({
      type: types.GET_REPORT_ITEMS_SUCCESS,
      response: data,
      modifiedMeta
    })
  } catch (error) {
    yield put({ type: types.GET_REPORT_ITEMS_ERROR, payload: error })
  }
}

function* deleteSelectedReports({ ids }) {
  try {
    yield call(reportService.deleteSelectedReports, ids)
    yield put({
      type: types.DELETE_SELECTED_REPORTS_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({
      type: types.DELETE_SELECTED_REPORTS_ERROR,
      payload: error
    })
  }
}

export default {
  getItems,
  deleteSelectedReports
}
