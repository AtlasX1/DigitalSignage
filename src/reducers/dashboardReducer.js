import update from 'immutability-helper'

import * as types from '../actions'

const initialState = {
  info: {},
  put: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_DASHBOARD_INFO_SUCCESS:
      return update(state, {
        info: {
          response: { $set: action.payload }
        }
      })
    case types.GET_DASHBOARD_INFO_ERROR:
      return update(state, {
        info: {
          error: { $set: action.payload }
        }
      })
    case types.PUT_DASHBOARD_INFO_SUCCESS:
      return update(state, {
        put: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_DASHBOARD_INFO_ERROR:
      return update(state, {
        put: {
          error: { $set: action.payload }
        }
      })
    default:
      return state
  }
}
