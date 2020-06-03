import update from 'immutability-helper'

import * as types from '../actions'

const initialState = {
  details: {},
  settings: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_USER_DETAILS_SUCCESS:
      return update(state, {
        details: {
          response: { $set: action.payload }
        }
      })
    case types.GET_USER_DETAILS_ERROR:
      return update(state, {
        details: {
          error: { $set: action.payload }
        }
      })
    case types.USER_DETAILS_CLEAR:
      return update(state, {
        details: { $set: {} }
      })
    case types.GET_USER_SETTINGS_SUCCESS:
      return update(state, {
        settings: {
          response: { $set: action.payload }
        }
      })
    case types.GET_USER_SETTINGS_ERROR:
      return update(state, {
        settings: {
          error: { $set: action.payload }
        }
      })
    case types.USER_SETTINGS_CLEAR:
      return update(state, {
        settings: { $set: {} }
      })
    default:
      return state
  }
}
