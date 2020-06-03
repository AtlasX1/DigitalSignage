import update from 'immutability-helper'
import * as types from 'actions'
import {
  initialState as templateInitialState,
  putInitialState,
  deleteInitialState,
  postInitialState,
  shapeOfBody,
  shapeOfBodyWithMeta
} from 'constants/initialLibraryState'

const initialState = {
  ...templateInitialState,
  groups: {
    ...shapeOfBodyWithMeta
  },
  ungroupedUsers: {
    ...shapeOfBodyWithMeta
  },
  groupItems: {},
  permission: {
    ...shapeOfBody
  },
  groupsPermission: {
    ...shapeOfBody
  },
  postGroupItem: {},
  deleteGroupItem: {},
  putPermission: {
    ...putInitialState
  },
  putGroupsPermission: {
    ...putInitialState
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_USERS_ITEMS_SUCCESS:
      return update(state, {
        items: {
          response: { $set: action.response },
          meta: {
            $set: action.modifiedMeta
          }
        }
      })
    case types.GET_USERS_ITEMS_ERROR:
      return update(state, {
        items: {
          error: { $set: action.payload }
        }
      })
    case types.POST_USERS_ITEM_SUCCESS:
      return update(state, {
        post: {
          response: { $set: action.payload }
        }
      })
    case types.POST_USERS_ITEM_ERROR:
      return update(state, {
        post: {
          error: { $set: action.payload }
        }
      })
    case types.DELETE_USERS_ITEM_SUCCESS:
      return update(state, {
        del: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_USERS_ITEM_ERROR:
      return update(state, {
        del: {
          error: { $set: action.payload }
        }
      })
    case types.DELETE_SELECTED_USERS_SUCCESS:
      return update(state, {
        del: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_SELECTED_USERS_ERROR:
      return update(state, {
        del: {
          error: { $set: action.payload }
        }
      })
    case types.GET_USERS_ITEM_SUCCESS:
      return update(state, {
        item: {
          response: { $set: action.payload }
        }
      })
    case types.GET_USERS_ITEM_ERROR:
      return update(state, {
        item: {
          error: { $set: action.payload }
        }
      })
    case types.PUT_USERS_ITEM_SUCCESS:
      return update(state, {
        put: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_USERS_ITEM_ERROR:
      return update(state, {
        put: {
          error: { $set: action.payload }
        }
      })
    case types.GET_USERS_GROUPS_SUCCESS:
      return update(state, {
        groups: {
          response: { $set: action.data },
          meta: { $set: action.modifiedMeta }
        }
      })
    case types.GET_USERS_GROUPS_ERROR:
      return update(state, {
        groups: {
          error: { $set: action.payload }
        }
      })
    case types.GET_UNGROUPED_USERS_SUCCESS:
      return update(state, {
        ungroupedUsers: {
          response: { $set: action.data },
          meta: { $set: action.modifiedMeta }
        }
      })
    case types.GET_UNGROUPED_USERS_ERROR:
      return update(state, {
        ungroupedUsers: {
          error: { $set: action.payload }
        }
      })
    case types.GET_USERS_GROUP_ITEMS_SUCCESS:
      return update(state, {
        groupItems: {
          response: { $set: action.payload },
          meta: { $set: action.modifiedMeta }
        }
      })
    case types.GET_USERS_GROUP_ITEMS_ERROR:
      return update(state, {
        groupItems: {
          error: { $set: action.payload }
        }
      })
    case types.POST_USERS_GROUP_ITEM_SUCCESS:
      return update(state, {
        postGroupItem: {
          response: { $set: action.payload }
        }
      })
    case types.POST_USERS_GROUP_ITEM_ERROR:
      return update(state, {
        postGroupItem: {
          error: { $set: action.payload }
        }
      })
    case types.DELETE_USERS_GROUP_ITEM_SUCCESS:
      return update(state, {
        deleteGroupItem: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_USERS_GROUP_ITEM_ERROR:
      return update(state, {
        deleteGroupItem: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_USERS_GROUP_ITEMS_INFO:
      return update(state, {
        groupItems: { $set: {} }
      })
    case types.CLEAR_USERS_GROUP_ITEMS_RESPONSE_INFO:
      return update(state, {
        $merge: {
          groupItems: {},
          postGroupItem: {},
          deleteGroupItem: {}
        }
      })
    case types.GET_USERS_PERMISSION_SUCCESS:
      return update(state, {
        permission: {
          response: { $set: action.payload }
        }
      })
    case types.GET_USERS_PERMISSION_ERROR:
      return update(state, {
        permission: {
          error: { $set: action.payload }
        }
      })
    case types.PUT_USERS_PERMISSION_SUCCESS:
      return update(state, {
        putPermission: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_USERS_PERMISSION_ERROR:
      return update(state, {
        putPermission: {
          error: { $set: action.payload }
        }
      })
    case types.GET_USERS_GROUP_PERMISSION_SUCCESS:
      return update(state, {
        groupsPermission: {
          response: { $set: action.payload }
        }
      })
    case types.GET_USERS_GROUP_PERMISSION_ERROR:
      return update(state, {
        groupsPermission: {
          error: { $set: action.payload }
        }
      })
    case types.PUT_USERS_GROUP_PERMISSION_SUCCESS:
      return update(state, {
        putGroupsPermission: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_USERS_GROUP_PERMISSION_ERROR:
      return update(state, {
        putGroupsPermission: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_USERS_RESPONSE_INFO:
      return update(state, {
        put: {
          $set: {
            ...putInitialState
          }
        },
        post: {
          $set: {
            ...postInitialState
          }
        },
        del: {
          $set: {
            ...deleteInitialState
          }
        },
        putGroupsPermission: {
          $set: {
            ...putInitialState
          }
        },
        putPermission: {
          $set: {
            ...putInitialState
          }
        },
        deleteGroupItem: {},
        postGroupItem: {}
      })
    case types.CLEAR_GET_USERS_PERMISSION_INFO:
      return update(state, {
        permission: { $set: { ...shapeOfBody } }
      })
    case types.CLEAR_GET_USERS_GROUP_PERMISSION_INFO:
      return update(state, {
        groupsPermission: { $set: { ...shapeOfBody } }
      })
    default:
      return state
  }
}
