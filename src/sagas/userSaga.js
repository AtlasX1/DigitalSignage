import { put, call } from 'redux-saga/effects'
import { userService } from '../services'

import * as types from '../actions'

function* getDetails() {
  try {
    const response = yield call(userService.getDetails)
    yield put({ type: types.GET_USER_DETAILS_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_USER_DETAILS_ERROR, payload: error })
  }
}

function* putDetails(action) {
  try {
    yield call(userService.putDetails, action.payload)
    yield put({ type: types.GET_USER_DETAILS })
  } catch (error) {
    console.log(error)
  }
}

export default {
  getDetails,
  putDetails
}
