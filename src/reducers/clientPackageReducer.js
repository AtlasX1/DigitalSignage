import update from 'immutability-helper'
import * as types from '../actions'
import {
  initialState,
  putInitialState,
  deleteInitialState,
  postInitialState
} from '../constants/initialLibraryState'

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_CLIENT_PACKAGES_SUCCESS:
      return update(state, {
        items: {
          response: { $set: action.response },
          meta: {
            $set: action.modifiedMeta
          }
        }
      })
    case types.GET_CLIENT_PACKAGES_ERROR:
      return update(state, {
        items: {
          error: { $set: action.payload }
        }
      })

    case types.POST_CLIENT_PACKAGE_SUCCESS:
      return update(state, {
        post: {
          response: { $set: action.payload }
        }
      })
    case types.POST_CLIENT_PACKAGE_ERROR:
      return update(state, {
        post: {
          error: { $set: action.payload }
        }
      })

    case types.DELETE_CLIENT_PACKAGE_SUCCESS:
      return update(state, {
        del: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_CLIENT_PACKAGE_ERROR:
      return update(state, {
        del: {
          error: { $set: action.payload }
        }
      })

    case types.DELETE_SELECTED_CLIENT_PACKAGES_SUCCESS:
      return update(state, {
        del: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_SELECTED_CLIENT_PACKAGES_ERROR:
      return update(state, {
        del: {
          error: { $set: action.payload }
        }
      })

    case types.GET_CLIENT_PACKAGE_BY_ID_SUCCESS:
      return update(state, {
        item: {
          response: { $set: action.payload }
        }
      })
    case types.GET_CLIENT_PACKAGE_BY_ID_ERROR:
      return update(state, {
        item: {
          error: { $set: action.payload }
        }
      })

    case types.PUT_CLIENT_PACKAGE_SUCCESS:
      return update(state, {
        put: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_CLIENT_PACKAGE_ERROR:
      return update(state, {
        put: {
          error: { $set: action.payload }
        }
      })

    case types.CLEAR_CLIENT_PACKAGE_RESPONSE_INFO:
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
    default:
      return state
  }
}
