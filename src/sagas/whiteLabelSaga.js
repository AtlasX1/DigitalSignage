import { call, put } from 'redux-saga/effects'

import * as types from 'actions/index'
import { whiteLabelService } from 'services/index'

function* getWhiteLabel() {
  try {
    const response = yield call(whiteLabelService.getWhiteLabel)
    yield put({ type: types.GET_WHITE_LABEL_SUCCESS, payload: response })
  } catch (error) {
    yield put({
      type: types.GET_WHITE_LABEL_SUCCESS,
      payload: { isEmpty: true }
    })
  }
}

export default {
  getWhiteLabel
}
