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
    case types.GET_REPORT_ITEMS_SUCCESS:
      return update(state, {
        library: {
          response: { $set: action.response },
          meta: {
            $set: action.modifiedMeta
          }
        }
      })
    case types.GET_REPORT_ITEMS_ERROR:
      return update(state, {
        library: {
          error: { $set: action.payload }
        }
      })

    case types.DELETE_SELECTED_REPORTS_SUCCESS:
      return update(state, {
        del: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_SELECTED_REPORTS_ERROR:
      return update(state, {
        del: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_REPORT_RESPONSE_INFO:
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
