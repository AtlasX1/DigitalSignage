import update from 'immutability-helper'

import * as types from '../actions'
import {
  shapeOfBodyWithMeta,
  deleteInitialState,
  shapeOfBody
} from 'constants/initialLibraryState'

const initialState = {
  library: shapeOfBodyWithMeta,
  preference: {},
  groups: {},
  groupItems: {},
  del: deleteInitialState,
  postGroupItem: {},
  deleteGroupItem: {},
  clone: {
    ...shapeOfBody,
    label: 'clone'
  },
  preview: {
    id: null,
    isVisible: false,
    isLoading: false,
    response: null,
    error: null
  },
  playlistItem: {
    status: null,
    response: null,
    error: null
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_PLAYLIST_ITEMS_SUCCESS:
      return update(state, {
        library: {
          response: { $set: action.response },
          meta: {
            $set: action.modifiedMeta
          }
        }
      })
    case types.GET_PLAYLIST_ITEMS_ERROR:
      return update(state, {
        library: {
          error: { $set: action.payload }
        }
      })

    case types.DELETE_PLAYLIST_SUCCESS:
      return update(state, {
        del: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_PLAYLIST_ERROR:
      return update(state, {
        del: {
          error: { $set: action.payload }
        }
      })

    case types.CLONE_PLAYLIST_SUCCESS:
      return update(state, {
        clone: {
          response: { $set: action.payload }
        }
      })
    case types.CLONE_PLAYLIST_ERROR:
      return update(state, {
        clone: {
          error: { $set: action.payload }
        }
      })

    case types.DELETE_SELECTED_PLAYLIST_SUCCESS:
      return update(state, {
        del: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_SELECTED_PLAYLIST_ERROR:
      return update(state, {
        del: {
          error: { $set: action.payload }
        }
      })

    case types.GET_PLAYLIST_PREFERENCE_SUCCESS:
      return update(state, {
        preference: {
          response: { $set: action.payload }
        }
      })
    case types.GET_PLAYLIST_PREFERENCE_ERROR:
      return update(state, {
        preference: {
          error: { $set: action.payload }
        }
      })

    case types.PUT_PLAYLIST_PREFERENCE_ERROR:
      return update(state, {
        performance: {
          error: { $set: action.payload }
        }
      })
    case types.GET_PLAYLIST_GROUPS_SUCCESS:
      return update(state, {
        groups: {
          response: { $set: action.payload }
        }
      })

    case types.GET_PLAYLIST_GROUPS_ERROR:
      return update(state, {
        groups: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_PLAYLIST_GROUP_INFO:
      return update(state, {
        groups: { $set: {} }
      })
    case types.GET_PLAYLIST_GROUP_ITEMS_SUCCESS:
      return update(state, {
        groupItems: {
          response: { $set: action.payload }
        }
      })
    case types.GET_PLAYLIST_GROUP_ITEMS_ERROR:
      return update(state, {
        groupItems: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_PLAYLIST_GROUP_ITEMS_INFO:
      return update(state, {
        groupItems: { $set: {} }
      })
    case types.POST_PLAYLIST_GROUP_ITEM_SUCCESS:
      return update(state, {
        postGroupItem: {
          response: { $set: action.payload }
        }
      })
    case types.POST_PLAYLIST_GROUP_ITEM_ERROR:
      return update(state, {
        postGroupItem: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_POST_PLAYLIST_GROUP_ITEM_INFO:
      return update(state, {
        postGroupItem: { $set: {} }
      })
    case types.CLEAR_PLAYLIST_GROUP_ITEMS_RESPONSE_INFO:
      return update(state, {
        $merge: {
          groupItems: {},
          postGroupItem: {},
          deleteGroupItem: {}
        }
      })
    case types.DELETE_PLAYLIST_GROUP_ITEM_SUCCESS:
      return update(state, {
        deleteGroupItem: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_PLAYLIST_GROUP_ITEM_ERROR:
      return update(state, {
        deleteGroupItem: {
          error: { $set: action.payload }
        }
      })
    case types.DELETE_PLAYLIST_GROUP_ITEM:
      return update(state, {
        deleteGroupItem: { $set: {} }
      })
    case types.GET_PLAYLIST_BY_ID_SUCCESS:
      return update(state, {
        playlistItem: {
          response: { $set: action.payload }
        }
      })
    case types.GET_PLAYLIST_BY_ID_ERROR:
      return update(state, {
        playlistItem: {
          error: { $set: action.payload }
        }
      })
    case types.PUT_PLAYLIST_SUCCESS:
      return update(state, {
        playlistItem: {
          status: { $set: 'successfully' }
        }
      })
    case types.PUT_PLAYLIST_ERROR:
      return update(state, {
        playlistItem: {
          status: { $set: 'error' },
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_ADDED_PLAYLIST:
      return update(state, {
        playlistItem: {
          status: { $set: null },
          response: { $set: null },
          error: { $set: null }
        }
      })
    case types.CLEAR_PLAYLIST_RESPONSE_INFO:
      return update(state, {
        del: {
          $set: deleteInitialState
        },
        clone: {
          $set: {
            ...shapeOfBody,
            label: 'clone'
          }
        }
      })

    default:
      return state
  }
}
