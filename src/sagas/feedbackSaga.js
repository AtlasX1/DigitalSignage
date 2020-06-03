import { call, put } from 'redux-saga/effects'

import { feedbackService } from '../services'

import * as types from '../actions'

function* postInfo(action) {
  try {
    const response = yield call(feedbackService.postInfo, action.payload)
    yield put({ type: types.POST_FEEDBACK_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.POST_FEEDBACK_ERROR, payload: error })
  }
}

export default {
  postInfo
}
