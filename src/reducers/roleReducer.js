import update from 'immutability-helper'
import * as types from '../actions'

const bodyShapes = {
  response: {},
  error: {}
}

const initialState = {
  put: {
    ...bodyShapes
  },
  post: {
    ...bodyShapes
  },
  role: {
    ...bodyShapes
  },
  roleById: {
    ...bodyShapes
  },
  permissionById: {
    ...bodyShapes
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_ROLES_SUCCESS:
      return update(state, {
        role: {
          response: { $set: action.payload }
        }
      })
    case types.GET_ROLES_ERROR:
      return update(state, {
        role: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_ROLES_INFO:
      return update(state, {
        role: { $set: initialState.role }
      })
    case types.GET_ROLE_BY_ID_SUCCESS:
      return update(state, {
        roleById: {
          response: { $set: action.payload }
        }
      })
    case types.GET_ROLE_BY_ID_ERROR:
      return update(state, {
        roleById: {
          error: { $set: action.payload }
        }
      })
    case types.POST_ROLE_SUCCESS:
      return update(state, {
        post: {
          response: { $set: action.payload }
        }
      })
    case types.POST_ROLE_ERROR:
      return update(state, {
        post: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_POST_ROLE_INFO:
      return update(state, {
        post: {
          $set: initialState.post
        }
      })
    case types.PUT_ROLE_BY_ID_SUCCESS:
      return update(state, {
        put: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_ROLE_BY_ID_ERROR:
      return update(state, {
        put: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_PUT_ROLE_INFO:
      return update(state, {
        put: {
          $set: initialState.put
        }
      })
    case types.GET_ROLE_PERMISSION_BY_ID_SUCCESS:
      return update(state, {
        permissionById: {
          response: { $set: action.payload }
        }
      })
    case types.GET_ROLE_PERMISSION_BY_ID_ERROR:
      return update(state, {
        permissionById: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_ROLE_PERMISSION_BY_ID_INFO:
      return update(state, {
        permissionById: {
          $set: initialState.permissionById
        }
      })
    case types.PUT_ROLE_PERMISSION_BY_ID_SUCCESS:
      return update(state, {
        put: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_ROLE_PERMISSION_BY_ID_ERROR:
      return update(state, {
        put: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_PUT_ROLE_PERMISSION_BY_ID_INFO:
      return update(state, {
        put: {
          $set: initialState.put
        }
      })
    default:
      return state
  }
}
