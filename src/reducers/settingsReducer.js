import update from 'immutability-helper'

import * as types from '../actions'

const initialState = {
  details: {},
  put: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_SETTINGS_SUCCESS:
      return update(state, {
        details: {
          response: { $set: action.payload }
        }
      })
    case types.GET_SETTINGS_ERROR:
      return update(state, {
        details: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_SETTINGS:
      return update(state, {
        details: { $set: {} }
      })
    case types.PUT_SETTINGS_SUCCESS:
      return update(state, {
        put: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_SETTINGS_ERROR:
      return update(state, {
        put: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_PUT_SETTINGS_INFO:
      return update(state, {
        put: { $set: {} }
      })
    default:
      return state
  }
}
