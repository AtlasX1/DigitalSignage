import * as types from './index'

export const getSettingsAction = () => ({ type: types.GET_SETTINGS })

export const clearSettingsAction = () => ({ type: types.CLEAR_SETTINGS })

export const putSettingsAction = data => ({
  type: types.PUT_SETTINGS,
  payload: data
})

export const clearPutSettingsInfoAction = () => ({
  type: types.CLEAR_PUT_SETTINGS_INFO
})
