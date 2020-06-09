import update from 'immutability-helper'

import * as types from '../actions'
import { shapeOfBodyWithMeta } from 'constants/initialLibraryState'

const initialState = {
  library: shapeOfBodyWithMeta,
  preference: {},
  groups: {},
  preview: {
    id: null,
    isVisible: false,
    isLoading: false,
    response: null,
    error: null
  },
  mediaItem: {
    status: null,
    response: null,
    error: null
  },
  put: {
    response: null,
    error: null
  },
  groupItems: {},
  postGroupItem: {},
  deleteGroupItem: {},
  featureMediaItems: {},
  capAlert: {
    isFetching: false,
    isFetched: false,
    items: [],
    error: null
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_MEDIA_ITEMS_SUCCESS:
      return update(state, {
        library: {
          response: { $set: action.payload }
        }
      })
    case types.GET_MEDIA_ITEMS_ERROR:
      return update(state, {
        library: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_MEDIA_ITEMS_INFO:
      return update(state, {
        library: { $set: {} }
      })
    case types.CLEAR_MEDIA_ITEMS:
      return update(state, {
        library: {
          response: { $set: [] }
        }
      })
    case types.GET_MEDIA_PREFERENCE_SUCCESS:
      return update(state, {
        preference: {
          response: { $set: action.payload }
        }
      })
    case types.GET_MEDIA_PREFERENCE_ERROR:
      return update(state, {
        preference: {
          error: { $set: action.payload }
        }
      })
    case types.PUT_MEDIA_PREFERENCE_SUCCESS:
      return update(state, {
        preference: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_MEDIA_PREFERENCE_ERROR:
      return update(state, {
        preference: {
          error: { $set: action.payload }
        }
      })
    case types.GET_MEDIA_GROUPS_SUCCESS:
      return update(state, {
        groups: {
          response: { $set: action.payload }
        }
      })
    case types.GET_MEDIA_GROUPS_ERROR:
      return update(state, {
        groups: {
          error: { $set: action.payload }
        }
      })
    case types.GET_MEDIA_PREVIEW:
      return update(state, {
        preview: {
          id: { $set: action.data },
          isVisible: { $set: true },
          isLoading: { $set: true },
          response: { $set: null },
          error: { $set: null }
        }
      })
    case types.GENERATE_MEDIA_PREVIEW:
      return update(state, {
        preview: {
          id: { $set: null },
          isVisible: { $set: true },
          isLoading: { $set: true },
          response: { $set: null },
          error: { $set: null }
        }
      })
    case types.GET_MEDIA_PREVIEW_SUCCESS:
    case types.GENERATE_MEDIA_PREVIEW_SUCCESS:
      return update(state, {
        preview: {
          isLoading: { $set: false },
          response: { $set: action.payload }
        }
      })
    case types.GET_MEDIA_PREVIEW_ERROR:
    case types.GENERATE_MEDIA_PREVIEW_ERROR:
      return update(state, {
        preview: {
          isVisible: { $set: false },
          isLoading: { $set: false },
          error: { $set: action.payload }
        }
      })
    case types.SHOW_MEDIA_PREVIEW:
      return update(state, {
        preview: {
          isVisible: { $set: true }
        }
      })
    case types.CLOSE_MEDIA_PREVIEW:
      return update(state, {
        preview: {
          isVisible: { $set: false }
        }
      })
    case types.CLEAR_MEDIA_PREVIEW:
      return update(state, {
        preview: {
          $merge: {
            id: null,
            isVisible: false,
            isLoading: false,
            response: null,
            error: null
          }
        }
      })
    case types.CLEAR_GET_MEDIA_GROUPS_INFO:
      return update(state, {
        groups: { $set: {} }
      })
    case types.GET_MEDIA_GROUP_ITEMS_SUCCESS:
      return update(state, {
        groupItems: {
          response: { $set: action.payload }
        }
      })
    case types.CLEAR_MEDIA_GROUP_ITEMS_RESPONSE_INFO:
      return update(state, {
        $merge: {
          groupItems: {},
          postGroupItem: {},
          deleteGroupItem: {}
        }
      })
    case types.GET_MEDIA_GROUP_ITEMS_ERROR:
      return update(state, {
        groupItems: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_MEDIA_GROUP_ITEMS_INFO:
      return update(state, {
        groupItems: { $set: {} }
      })
    case types.POST_MEDIA_GROUP_ITEM_SUCCESS:
      return update(state, {
        postGroupItem: {
          response: { $set: action.payload }
        }
      })
    case types.POST_MEDIA_GROUP_ITEM_ERROR:
      return update(state, {
        postGroupItem: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_POST_MEDIA_GROUP_ITEM_INFO:
      return update(state, {
        postGroupItem: { $set: {} }
      })
    case types.DELETE_MEDIA_GROUP_ITEM_SUCCESS:
      return update(state, {
        deleteGroupItem: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_MEDIA_GROUP_ITEM_ERROR:
      return update(state, {
        deleteGroupItem: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_DELETE_MEDIA_GROUP_ITEM_INFO:
      return update(state, {
        deleteGroupItem: { $set: {} }
      })
    case types.GET_MEDIA_ITEM_BY_ID_SUCCESS:
      return update(state, {
        mediaItem: {
          response: { $set: action.payload }
        }
      })
    case types.GET_MEDIA_ITEM_BY_ID_ERROR:
      return update(state, {
        mediaItem: {
          error: { $set: action.payload }
        }
      })
    case types.PUT_MEDIA_SUCCESS:
      return update(state, {
        mediaItem: {
          status: { $set: 'successfully' }
        },
        put: {
          response: { $set: 'successfully' }
        }
      })
    case types.PUT_MEDIA_ERROR:
      return update(state, {
        mediaItem: {
          status: { $set: 'error' },
          error: { $set: action.payload }
        },
        put: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_MEDIA_ITEM_STATUS:
      return update(state, {
        mediaItem: {
          status: { $set: 'null' }
        }
      })
    case types.CREAR_MEDIA_ITEM:
      return update(state, {
        mediaItem: {
          status: { $set: null },
          response: { $set: null },
          error: { $set: null }
        }
      })
    case types.CLEAR_MEDIA_PUT:
      return update(state, {
        put: {
          response: { $set: null },
          error: { $set: null }
        }
      })
    case types.GET_FEATURE_MEDIA_ITEMS_SUCCESS:
      return update(state, {
        featureMediaItems: {
          response: { $set: action.payload }
        }
      })
    case types.GET_FEATURE_MEDIA_ITEMS_ERROR:
      return update(state, {
        featureMediaItems: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_FEATURE_MEDIA_ITEMS_INFO:
      return update(state, {
        featureMediaItems: { $set: {} }
      })
    case types.REQUEST_MEDIA_CAP_ALERT:
      return update(state, {
        capAlert: {
          isFetching: { $set: true }
        }
      })
    case types.MEDIA_CAP_ALERT_SUCCESS:
      return update(state, {
        capAlert: {
          $merge: {
            isFetching: false,
            isFetched: true,
            items: action.payload,
            error: null
          }
        }
      })
    case types.MEDIA_CAP_ALERT_ERROR:
      return update(state, {
        capAlert: {
          $merge: {
            isFetching: false,
            isFetched: true,
            error: action.payload
          }
        }
      })
    default:
      return state
  }
}
