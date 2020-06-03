import update from 'immutability-helper'

import * as types from '../actions'

const shapeOfBody = {
  response: [],
  error: {}
}

const putInitialState = {
  ...shapeOfBody,
  label: 'update'
}

const initialState = {
  items: {
    ...shapeOfBody,
    meta: {
      currentPage: 1,
      from: 0,
      lastPage: 0,
      perPage: 0,
      to: 0,
      total: 0,
      count: 0,
      isLoading: true
    }
  },
  put: {
    ...putInitialState
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_HELPS_SUCCESS:
      return update(state, {
        items: {
          response: { $set: action.response },
          meta: {
            $set: action.modifiedMeta
          }
        }
      })
    case types.GET_HELPS_ERROR:
      return update(state, {
        items: {
          error: { $set: action.payload }
        }
      })
    case types.PUT_HELP_SUCCESS:
      return update(state, {
        put: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_HELP_ERROR:
      return update(state, {
        put: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_HELP_RESPONSE_INFO:
      return update(state, {
        put: {
          $set: {
            ...putInitialState
          }
        }
      })
    default:
      return state
  }
}
