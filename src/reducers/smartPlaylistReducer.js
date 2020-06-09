import update from 'immutability-helper'

import * as types from '../actions'
import { shapeOfBody } from 'constants/initialLibraryState'

const initialState = {
  preview: {
    id: null,
    isVisible: false,
    isLoading: false,
    response: null,
    error: null
  },
  smartPlaylistItem: {
    status: null,
    response: null,
    error: null
  },
  smartPlaylistMedia: {
    ...shapeOfBody
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.BUILD_SMART_PLAYLIST_SUCCESS:
      return update(state, {
        smartPlaylistMedia: {
          response: { $set: action.payload }
        }
      })
    case types.BUILD_SMART_PLAYLIST_ERROR:
      return update(state, {
        library: {
          error: { $set: action.payload }
        }
      })
    case types.POST_SMART_PLAYLIST_SUCCESS:
      return update(state, {
        smartPlaylistItem: {
          status: { $set: 'successfully' },
          response: { $set: action.payload }
        }
      })
    case types.POST_SMART_PLAYLIST_ERROR:
      return update(state, {
        smartPlaylistItem: {
          status: { $set: 'error' },
          error: { $set: action.payload }
        }
      })
    case types.PUT_SMART_PLAYLIST_SUCCESS:
      return update(state, {
        smartPlaylistItem: {
          status: { $set: 'successfully' },
          response: { $set: action.payload }
        }
      })
    case types.PUT_SMART_PLAYLIST_ERROR:
      return update(state, {
        smartPlaylistItem: {
          status: { $set: 'error' },
          error: { $set: action.payload }
        }
      })

    case types.CLEAR_SMART_PLAYLIST_STATUS:
      return update(state, {
        smartPlaylistItem: {
          status: { $set: null }
        }
      })

    case types.CLEAR_ADDED_SMART_PLAYLIST:
      return update(state, {
        smartPlaylistItem: {
          status: { $set: null },
          response: { $set: null },
          error: { $set: null }
        },
        smartPlaylistMedia: {
          response: { $set: null },
          error: { $set: null }
        }
      })
    default:
      return state
  }
}
