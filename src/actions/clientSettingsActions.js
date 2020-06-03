import * as types from './index'

const putClientSettingsAction = data => ({
  type: types.PUT_CLIENT_SETTINGS,
  payload: data
})

const clearPutClientSettingsInfoAction = () => ({
  type: types.CLEAR_PUT_CLIENT_SETTINGS_INFO
})

export { putClientSettingsAction, clearPutClientSettingsInfoAction }
