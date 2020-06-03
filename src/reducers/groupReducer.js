import update from 'immutability-helper'

import * as types from '../actions'
import entityGroupsConstants from 'constants/entityGroupsConstants'
import {
  deleteInitialState,
  postInitialState,
  putInitialState,
  shapeOfBody,
  shapeOfMeta
} from 'constants/initialLibraryState'

const structureCategories = Object.keys(entityGroupsConstants).reduce(
  (accum, key) => ({
    ...accum,
    [key]: {
      ...shapeOfBody,
      ...shapeOfMeta
    }
  }),
  {}
)

const initialState = {
  ...structureCategories,
  post: {
    ...postInitialState
  },
  del: {
    ...deleteInitialState
  },
  put: {
    ...putInitialState
  },
  permission: {},
  putPermission: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_GROUPS_BY_ENTITY_SUCCESS:
      return update(state, {
        [action.payload.entity]: {
          response: { $set: action.payload.data },
          meta: { $set: action.payload.modifiedMeta }
        }
      })
    case types.GET_GROUPS_BY_ENTITY_ERROR:
      return update(state, {
        [action.payload.entity]: {
          error: { $set: action.payload.error }
        }
      })
    case types.POST_GROUP_SUCCESS:
      return update(state, {
        post: {
          response: { $set: action.payload }
        }
      })
    case types.POST_GROUP_ERROR:
      return update(state, {
        post: {
          error: { $set: action.payload }
        }
      })
    // case types.CLEAR_POST_GROUP_INFO:
    //   return update(state, {
    //     post: { $set: {} }
    //   })
    case types.DELETE_GROUP_SUCCESS:
      return update(state, {
        del: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_GROUP_ERROR:
      return update(state, {
        del: {
          error: { $set: action.payload }
        }
      })
    // case types.CLEAR_DELETE_GROUP_INFO:
    //   return update(state, {
    //     del: { $set: {} }
    //   })
    case types.PUT_GROUP_SUCCESS:
      return update(state, {
        put: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_GROUP_ERROR:
      return update(state, {
        put: {
          error: { $set: action.payload }
        }
      })
    // case types.CLEAR_PUT_GROUP_INFO:
    //   return update(state, {
    //     put: { $set: {} }
    //   })
    case types.CLEAR_UPDATE_GROUP_INFO: {
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
        }
      })
    }
    case types.GET_GROUP_PERMISSION_SUCCESS:
      return update(state, {
        permission: {
          response: { $set: action.payload }
        }
      })
    case types.GET_GROUP_PERMISSION_ERROR:
      return update(state, {
        permission: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_GROUP_PERMISSION_INFO:
      return update(state, {
        permission: { $set: {} }
      })
    case types.PUT_GROUP_PERMISSION_SUCCESS:
      return update(state, {
        putPermission: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_GROUP_PERMISSION_ERROR:
      return update(state, {
        putPermission: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_PUT_GROUP_PERMISSION_INFO:
      return update(state, {
        putPermission: { $set: {} }
      })
    default:
      return state
  }
}
