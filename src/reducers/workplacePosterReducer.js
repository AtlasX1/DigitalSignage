import update from 'immutability-helper'
import {
  shapeOfBody,
  initialState,
  putInitialState,
  postInitialState,
  deleteInitialState
} from '../constants/initialLibraryState'

import * as types from '../actions'

const workplacePosterInitialState = {
  ...initialState,
  tags: {
    ...shapeOfBody
  },
  postTag: {
    ...postInitialState
  },
  delTag: {
    ...deleteInitialState
  }
}

export default (state = workplacePosterInitialState, action) => {
  switch (action.type) {
    case types.GET_WORKPLACE_POSTERS_SUCCESS:
      return update(state, {
        items: {
          response: { $set: action.response },
          meta: {
            $merge: action.modifiedMeta
          }
        }
      })
    case types.GET_WORKPLACE_POSTERS_ERROR:
      return update(state, {
        items: {
          error: { $set: action.payload }
        }
      })
    case types.POST_WORKPLACE_POSTER_SUCCESS:
      return update(state, {
        post: {
          response: { $set: action.payload }
        }
      })
    case types.POST_WORKPLACE_POSTER_ERROR:
      return update(state, {
        post: {
          error: { $set: action.payload }
        }
      })
    case types.DELETE_WORKPLACE_POSTER_SUCCESS:
      return update(state, {
        del: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_WORKPLACE_POSTER_ERROR:
      return update(state, {
        del: {
          error: { $set: action.payload }
        }
      })
    case types.GET_WORKPLACE_POSTER_SUCCESS:
      return update(state, {
        item: {
          response: { $set: action.payload }
        }
      })
    case types.GET_WORKPLACE_POSTER_ERROR:
      return update(state, {
        item: {
          error: { $set: action.payload }
        }
      })
    case types.PUT_WORKPLACE_POSTER_SUCCESS:
      return update(state, {
        put: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_WORKPLACE_POSTER_ERROR:
      return update(state, {
        put: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_WORKPLACE_POSTERS_RESPONSE_INFO:
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
        delTag: {
          $set: {
            ...deleteInitialState
          }
        },
        postTag: {
          $set: {
            ...postInitialState
          }
        }
      })
    case types.DELETE_SELECTED_WORKPLACE_POSTERS_SUCCESS:
      return update(state, {
        del: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_SELECTED_WORKPLACE_POSTERS_ERROR:
      return update(state, {
        del: {
          error: { $set: action.payload }
        }
      })
    case types.GET_WORKPLACE_POSTERS_TAGS_SUCCESS:
      return update(state, {
        tags: {
          response: { $set: action.response }
        }
      })
    case types.GET_WORKPLACE_POSTERS_TAGS_ERROR:
      return update(state, {
        tags: {
          error: { $set: action.payload }
        }
      })
    case types.POST_WORKPLACE_POSTER_TAG_SUCCESS:
      return update(state, {
        postTag: {
          response: { $set: action.payload }
        }
      })
    case types.POST_WORKPLACE_POSTER_TAG_ERROR:
      return update(state, {
        postTag: {
          error: { $set: action.payload }
        }
      })
    case types.DELETE_WORKPLACE_POSTER_TAG_SUCCESS:
      return update(state, {
        delTag: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_WORKPLACE_POSTER_TAG_ERROR:
      return update(state, {
        delTag: {
          error: { $set: action.payload }
        }
      })
    default:
      return state
  }
}
