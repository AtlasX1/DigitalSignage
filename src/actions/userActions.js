import * as types from './index'

export const getUserDetailsAction = () => ({ type: types.GET_USER_DETAILS })

export const putUserDetailsAction = data => ({
  type: types.PUT_USER_DETAILS,
  payload: data
})

export const clearUserDetailsAction = () => ({ type: types.USER_DETAILS_CLEAR })

export const getUserSettingsAction = () => ({ type: types.GET_USER_SETTINGS })

export const clearUserSettingsAction = () => ({
  type: types.USER_SETTINGS_CLEAR
})
