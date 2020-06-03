import update from 'immutability-helper'
import {
  shapeOfBodyWithMeta,
  postInitialState
} from '../constants/initialLibraryState'

import * as types from '../actions'

const quoteInitialState = {
  items: { ...shapeOfBodyWithMeta },
  post: { ...postInitialState },
  categories: {
    ...shapeOfBodyWithMeta
  }
}

export default (state = quoteInitialState, action) => {
  switch (action.type) {
    case types.GET_QUOTES_SUCCESS:
      return update(state, {
        items: {
          response: { $set: action.response.data }
        },
        meta: {
          $set: action.response.meta
        }
      })
    case types.GET_QUOTES_ERROR:
      return update(state, {
        error: { $set: action.error }
      })
    case types.CLEAR_GET_QUOTES_INFO:
      return update(state, {
        response: {
          $set: {}
        }
      })

    case types.POST_QUOTE_SUCCESS:
      return update(state, {
        post: {
          $merge: { response: { $set: action.response.data } }
        }
      })
    case types.POST_QUOTE_ERROR:
      return update(state, {
        post: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_POST_QUOTE_INFO:
      return update(state, {
        response: {
          $set: {}
        }
      })

    case types.GET_QUOTE_CATEGORIES_SUCCESS:
      return update(state, {
        categories: {
          response: { $set: action.response.data },
          meta: {
            $set: action.response.meta
          }
        }
      })
    case types.GET_QUOTE_CATEGORIES_ERROR:
      return update(state, {
        categories: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_QUOTE_CATEGORIES_INFO:
      return update(state, {
        categories: {
          $set: {}
        }
      })
    default:
      return state
  }
}
