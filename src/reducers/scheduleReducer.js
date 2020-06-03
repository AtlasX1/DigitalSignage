import update from 'immutability-helper'

import * as types from '../actions'
import {
  deleteInitialState,
  shapeOfBody,
  shapeOfBodyWithMeta
} from 'constants/initialLibraryState'

const initialState = {
  library: shapeOfBodyWithMeta,
  del: deleteInitialState,
  clone: {
    ...shapeOfBody,
    label: 'clone'
  },
  preference: {},
  groups: {},
  groupItems: {},
  postGroupItem: {},
  deleteGroupItem: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_SCHEDULE_ITEMS_SUCCESS:
      return update(state, {
        library: {
          response: { $set: action.response },
          meta: {
            $set: action.modifiedMeta
          }
        }
      })
    case types.GET_SCHEDULE_ITEMS_ERROR:
      return update(state, {
        library: {
          error: { $set: action.payload }
        }
      })
    case types.GET_SCHEDULE_PREFERENCE_SUCCESS:
      return update(state, {
        preference: {
          response: { $set: action.payload }
        }
      })
    case types.GET_SCHEDULE_PREFERENCE_ERROR:
      return update(state, {
        preference: {
          error: { $set: action.payload }
        }
      })
    case types.PUT_SCHEDULE_PREFERENCE_ERROR:
      return update(state, {
        performance: {
          error: { $set: action.payload }
        }
      })
    case types.GET_SCHEDULE_GROUPS_SUCCESS:
      return update(state, {
        groups: {
          response: { $set: action.payload }
        }
      })
    case types.GET_SCHEDULE_GROUPS_ERROR:
      return update(state, {
        groups: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_SCHEDULE_GROUPS_INFO:
      return update(state, {
        groups: { $set: {} }
      })
    case types.GET_SCHEDULE_GROUP_ITEMS_SUCCESS:
      return update(state, {
        groupItems: {
          response: { $set: action.payload }
        }
      })
    case types.GET_SCHEDULE_GROUP_ITEMS_ERROR:
      return update(state, {
        groupItems: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_SCHEDULE_GROUP_ITEMS_INFO:
      return update(state, {
        groupItems: { $set: {} }
      })
    case types.CLEAR_SCHEDULE_GROUP_ITEMS_RESPONSE_INFO:
      return update(state, {
        $merge: {
          groupItems: {},
          postGroupItem: {},
          deleteGroupItem: {}
        }
      })
    case types.POST_SCHEDULE_GROUP_ITEM_SUCCESS:
      return update(state, {
        postGroupItem: {
          response: { $set: action.payload }
        }
      })
    case types.POST_SCHEDULE_GROUP_ITEM_ERROR:
      return update(state, {
        postGroupItem: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_POST_SCHEDULE_GROUP_ITEM_INFO:
      return update(state, {
        postGroupItem: { $set: {} }
      })
    case types.DELETE_SCHEDULE_GROUP_ITEM_SUCCESS:
      return update(state, {
        deleteGroupItem: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_SCHEDULE_GROUP_ITEM_ERROR:
      return update(state, {
        deleteGroupItem: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_DELETE_SCHEDULE_GROUP_ITEM_INFO:
      return update(state, {
        deleteGroupItem: { $set: {} }
      })

    case types.DELETE_SCHEDULE_SUCCESS:
      return update(state, {
        del: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_SCHEDULE_ERROR:
      return update(state, {
        del: {
          error: { $set: action.payload }
        }
      })

    case types.CLONE_SCHEDULE_SUCCESS:
      return update(state, {
        clone: {
          response: { $set: action.payload }
        }
      })
    case types.CLONE_SCHEDULE_ERROR:
      return update(state, {
        clone: {
          error: { $set: action.payload }
        }
      })

    case types.DELETE_SELECTED_SCHEDULES_SUCCESS:
      return update(state, {
        del: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_SELECTED_SCHEDULES_ERROR:
      return update(state, {
        del: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_SCHEDULE_RESPONSE_INFO:
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
