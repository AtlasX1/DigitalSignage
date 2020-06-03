import update from 'immutability-helper'
import * as types from '../actions'
import {
  initialState as initialLibraryState,
  putInitialState,
  deleteInitialState,
  postInitialState
} from 'constants/initialLibraryState'

const initialState = {
  ...initialLibraryState,
  note: {},
  postNote: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_CLIENTS_SUCCESS:
      return update(state, {
        items: {
          response: { $set: action.response },
          meta: {
            $merge: action.modifiedMeta
          }
        }
      })
    case types.GET_CLIENTS_ERROR:
      return update(state, {
        items: {
          error: { $set: action.payload }
        }
      })

    case types.POST_CLIENT_SUCCESS:
      return update(state, {
        post: {
          response: { $set: action.payload }
        }
      })
    case types.POST_CLIENT_ERROR:
      return update(state, {
        post: {
          error: { $set: action.payload }
        }
      })

    case types.GET_CLIENT_BY_ID_SUCCESS:
      return update(state, {
        item: {
          response: { $set: action.payload }
        }
      })
    case types.GET_CLIENT_BY_ID_ERROR:
      return update(state, {
        item: {
          error: { $set: action.payload }
        }
      })

    case types.PUT_CLIENT_SUCCESS:
      return update(state, {
        put: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_CLIENT_ERROR:
      return update(state, {
        put: {
          error: { $set: action.payload }
        }
      })

    case types.CLEAR_CLIENT_RESPONSE_INFO:
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

    case types.GET_CLIENT_GROUP_ITEMS_SUCCESS:
      return update(state, {
        groupItems: {
          response: { $set: action.payload }
        }
      })
    case types.GET_CLIENT_GROUP_ITEMS_ERROR:
      return update(state, {
        groupItems: {
          error: { $set: action.payload }
        }
      })

    case types.POST_CLIENT_GROUP_ITEM_SUCCESS:
      return update(state, {
        postGroupItem: {
          response: { $set: action.payload }
        }
      })
    case types.POST_CLIENT_GROUP_ITEM_ERROR:
      return update(state, {
        postGroupItem: {
          error: { $set: action.payload }
        }
      })

    case types.DELETE_CLIENT_GROUP_ITEM_SUCCESS:
      return update(state, {
        deleteGroupItem: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_CLIENT_GROUP_ITEM_ERROR:
      return update(state, {
        deleteGroupItem: {
          error: { $set: action.payload }
        }
      })

    case types.CLEAR_CLIENT_GROUP_ITEMS_RESPONSE_INFO:
      return update(state, {
        groupItems: {
          $set: {}
        },
        postGroupItem: {
          $set: {}
        },
        deleteGroupItem: {
          $set: {}
        }
      })
    case types.CLEAR_GET_CLIENTS_GROUP_ITEMS_INFO:
      return update(state, {
        groupItems: { $set: {} }
      })
    case types.GET_CLIENT_NOTES_SUCCESS:
      return update(state, {
        note: {
          response: { $set: action.payload }
        }
      })

    case types.GET_CLIENT_NOTES_ERROR:
      return update(state, {
        note: {
          error: { $set: action.payload }
        }
      })

    case types.POST_CLIENT_NOTE_SUCCESS:
      return update(state, {
        postNote: {
          response: { $set: action.payload }
        }
      })

    case types.POST_CLIENT_NOTE_ERROR:
      return update(state, {
        postNote: {
          error: { $set: action.payload }
        }
      })

    case types.CLEAR_GET_CLIENT_NOTE_INFO:
      return update(state, {
        note: { $set: {} }
      })

    case types.CLEAR_POST_CLIENT_NOTE_INFO:
      return update(state, {
        postNote: { $set: {} }
      })

    default:
      return state
  }
}
