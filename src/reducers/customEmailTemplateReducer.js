import update from 'immutability-helper'

import * as types from '../actions'
import {
  initialState,
  putInitialState,
  postInitialState
} from '../constants/initialLibraryState'

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_CUSTOM_EMAIL_TEMPLATES_SUCCESS:
      return update(state, {
        items: {
          response: { $set: action.response },
          meta: {
            $set: action.modifiedMeta
          }
        }
      })
    case types.GET_CUSTOM_EMAIL_TEMPLATES_ERROR:
      return update(state, {
        items: {
          error: { $set: action.payload }
        }
      })
    case types.GET_CUSTOM_EMAIL_TEMPLATE_BY_ID_SUCCESS:
      return update(state, {
        item: {
          response: { $set: action.payload }
        }
      })
    case types.GET_CUSTOM_EMAIL_TEMPLATE_BY_ID_ERROR:
      return update(state, {
        item: {
          error: { $set: action.payload }
        }
      })
    case types.PUT_CUSTOM_EMAIL_TEMPLATE_SUCCESS:
      return update(state, {
        put: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_CUSTOM_EMAIL_TEMPLATE_ERROR:
      return update(state, {
        put: {
          error: { $set: action.payload }
        }
      })
    case types.POST_CUSTOM_EMAIL_TEMPLATE_SUCCESS:
      return update(state, {
        post: {
          response: { $set: action.payload }
        }
      })
    case types.POST_CUSTOM_EMAIL_TEMPLATE_ERROR:
      return update(state, {
        post: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_CUSTOM_EMAIL_TEMPLATE_RESPONSE_INFO:
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
        }
      })
    default:
      return state
  }
}
