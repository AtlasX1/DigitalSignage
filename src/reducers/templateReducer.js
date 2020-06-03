import update from 'immutability-helper'

import * as types from '../actions'
import {
  deleteInitialState,
  shapeOfBody,
  shapeOfBodyWithMeta
} from 'constants/initialLibraryState'

const initialState = {
  library: shapeOfBodyWithMeta,
  preference: {},
  groups: {},
  groupItems: {},
  postGroupItem: {},
  deleteGroupItem: {},
  templateItem: {
    status: null,
    response: null,
    error: null
  },
  del: deleteInitialState,
  clone: {
    ...shapeOfBody,
    label: 'clone'
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.CLEAR_TEMPLATE_ITEM:
      return update(state, {
        templateItem: {
          status: { $set: 'null' },
          response: { $set: null },
          error: { $set: null }
        }
      })
    case types.GET_TEMPLATE_SUCCESS:
      return update(state, {
        templateItem: {
          response: { $set: action.payload }
        }
      })
    case types.GET_TEMPLATE_ERROR:
      return update(state, {
        templateItem: {
          error: { $set: action.payload }
        }
      })
    case types.POST_TEMPLATE_SUCCESS:
    case types.PUT_TEMPLATE_SUCCESS:
      return update(state, {
        templateItem: {
          status: { $set: 'successfully' }
        }
      })
    case types.POST_TEMPLATE_ERROR:
    case types.PUT_TEMPLATE_ERROR:
      return update(state, {
        templateItem: {
          status: { $set: 'error' },
          error: { $set: action.payload }
        }
      })
    case types.GET_TEMPLATE_ITEMS_SUCCESS:
      return update(state, {
        library: {
          response: { $set: action.response },
          meta: {
            $set: action.modifiedMeta
          }
        }
      })
    case types.GET_TEMPLATE_ITEMS_ERROR:
      return update(state, {
        library: {
          error: { $set: action.payload }
        }
      })
    case types.GET_TEMPLATE_PREFERENCE_SUCCESS:
      return update(state, {
        preference: {
          response: { $set: action.payload }
        }
      })
    case types.GET_TEMPLATE_PREFERENCE_ERROR:
      return update(state, {
        preference: {
          error: { $set: action.payload }
        }
      })
    case types.PUT_TEMPLATE_PREFERENCE_ERROR:
      return update(state, {
        performance: {
          error: { $set: action.payload }
        }
      })
    case types.GET_TEMPLATE_GROUPS_SUCCESS:
      return update(state, {
        groups: {
          response: { $set: action.payload }
        }
      })
    case types.GET_TEMPLATE_GROUPS_ERROR:
      return update(state, {
        groups: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_TEMPLATE_GROUPS_INFO:
      return update(state, {
        groups: { $set: {} }
      })
    case types.GET_TEMPLATE_GROUP_ITEMS_SUCCESS:
      return update(state, {
        groupItems: {
          response: { $set: action.payload }
        }
      })
    case types.GET_TEMPLATE_GROUP_ITEMS_ERROR:
      return update(state, {
        groupItems: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_TEMPLATE_GROUP_ITEMS_INFO:
      return update(state, {
        groupItems: { $set: {} }
      })
    case types.POST_TEMPLATE_GROUP_ITEM_SUCCESS:
      return update(state, {
        postGroupItem: {
          response: { $set: action.payload }
        }
      })
    case types.POST_TEMPLATE_GROUP_ITEM_ERROR:
      return update(state, {
        postGroupItem: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_POST_TEMPLATE_GROUP_ITEM_INFO:
      return update(state, {
        postGroupItem: { $set: {} }
      })
    case types.DELETE_TEMPLATE_GROUP_ITEM_SUCCESS:
      return update(state, {
        deleteGroupItem: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_TEMPLATE_GROUP_ITEM_ERROR:
      return update(state, {
        deleteGroupItem: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_DELETE_TEMPLATE_GROUP_ITEM_INFO:
      return update(state, {
        deleteGroupItem: { $set: {} }
      })

    case types.DELETE_TEMPLATE_SUCCESS:
      return update(state, {
        del: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_TEMPLATE_ERROR:
      return update(state, {
        del: {
          error: { $set: action.payload }
        }
      })

    case types.CLONE_TEMPLATE_SUCCESS:
      return update(state, {
        clone: {
          response: { $set: action.payload }
        }
      })
    case types.CLONE_TEMPLATE_ERROR:
      return update(state, {
        clone: {
          error: { $set: action.payload }
        }
      })

    case types.DELETE_SELECTED_TEMPLATE_SUCCESS:
      return update(state, {
        del: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_SELECTED_TEMPLATE_ERROR:
      return update(state, {
        del: {
          error: { $set: action.payload }
        }
      })

    case types.CLEAR_TEMPLATE_RESPONSE_INFO:
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
    case types.CLEAR_TEMPLATE_GROUP_ITEMS_RESPONSE_INFO:
      return update(state, {
        $merge: {
          groupItems: {},
          postGroupItem: {},
          deleteGroupItem: {}
        }
      })
    default:
      return state
  }
}
