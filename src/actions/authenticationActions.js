import * as types from './index'

export const loginUserAction = user => ({ type: types.LOGIN_USER, user })

export const loginOktaAction = data => ({ type: types.LOGIN_USER_OKTA, data })

export const clearLoginInfo = () => ({ type: types.CLEAR_LOGIN_INFO })

export const logoutUserAction = () => ({ type: types.LOGOUT_USER })

export const clearLogoutInfo = () => ({ type: types.CLEAR_LOGOUT_INFO })

export const updateTokenAction = () => ({ type: types.UPDATE_USER_TOKEN })

export const recoveryAction = email => ({ type: types.RECOVERY_USER, email })

export const resetAction = data => ({
  type: types.RESET_PASSWORD,
  payload: data
})

export const impersonateUserAction = data => ({
  type: types.IMPERSONATE_USER,
  payload: data
})
