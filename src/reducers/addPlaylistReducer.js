import update from 'immutability-helper'

import * as types from '../actions'

const initialState = {
  response: null,
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.POST_PLAYLIST_SUCCESS:
      return update(state, {
        response: { $set: action.payload }
      })
    case types.POST_PLAYLIST_ERROR:
      return update(state, {
        error: { $set: action.payload }
      })

    case types.CLEAR_ADDED_PLAYLIST:
      return update(state, {
        $set: initialState
      })
    default:
      return state
  }
}
