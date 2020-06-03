import update from 'immutability-helper'

import * as types from '../actions'

const initialState = {
  put: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.PUT_CLIENT_SETTINGS_SUCCESS:
      return update(state, {
        put: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_CLIENT_SETTINGS_ERROR:
      return update(state, {
        put: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_PUT_CLIENT_SETTINGS_INFO:
      return update(state, {
        put: { $set: {} }
      })
    default:
      return state
  }
}
