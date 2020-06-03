import { put, call, select } from 'redux-saga/effects'
import { loginUserService } from '../services'

import {
  logoutUserService,
  loginSocialService,
  updateTokenService,
  recovery,
  reset
} from '../services'
import * as types from '../actions'
import {
  impersonateSystemUserService,
  impersonateUserService
} from 'services/authenticationService'
import roles from 'utils/roles'

export function* loginSaga(payload) {
  try {
    const response = yield call(loginUserService, payload)
    yield put({ type: types.LOGIN_USER_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.LOGIN_USER_ERROR, payload: error })
  }
}

export function* loginOktaSaga(payload) {
  try {
    const response = yield call(loginSocialService, payload.data)
    yield put({ type: types.LOGIN_USER_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.LOGIN_USER_ERROR, payload: error })
  }
}

export function* logoutSaga() {
  try {
    const response = yield call(logoutUserService)
    yield put({ type: types.LOGOUT_USER_ACCESS, response })
  } catch (error) {
    yield put({ type: types.LOGOUT_USER_ERROR, error })
  }
}

export function* updateTokenSaga() {
  try {
    const response = yield call(updateTokenService)
    yield put({ type: types.LOGIN_USER_SUCCESS, response })
  } catch (error) {
    yield put({ type: types.LOGIN_USER_ERROR, error })
  }
}

export function* recoverySaga(payload) {
  try {
    const response = yield call(recovery, payload.email)
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

export function* resetSaga(action) {
  try {
    const response = yield call(reset, action.payload)
    yield put({ type: types.RESET_PASSWORD_SUCCESS, response })
  } catch (error) {
    yield put({ type: types.RESET_PASSWORD_ERROR, error })
  }
}

export function* impersonateSaga({ payload }) {
  try {
    const { role } = yield select(({ user: { details } }) => details.response)
    const parsedRole = roles.parse(role)
    const usedService = parsedRole.system
      ? impersonateSystemUserService
      : impersonateUserService
    const response = yield call(usedService, payload)
    yield put({ type: types.IMPERSONATE_USER_SUCCESS, response })
  } catch (error) {
    yield put({ type: types.IMPERSONATE_USER_ERROR, error })
  }
}
