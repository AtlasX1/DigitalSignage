import * as types from 'actions'
import update from 'immutability-helper'
import { putInitialState } from 'constants/initialLibraryState'
import entityConstants from 'constants/entityConstants'

const structurePreferences = Object.keys(entityConstants).reduce(
  (accum, key) => ({
    ...accum,
    [key]: {
      status: 'not received',
      response: {},
      error: {}
    }
  }),
  {}
)

const initialState = {
  ...structurePreferences,
  put: putInitialState
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_PREFERENCE_BY_ENTITY_SUCCESS:
      return update(state, {
        [action.entity]: {
          response: { $set: action.response },
          status: { $set: action.status }
        }
      })
    case types.GET_PREFERENCE_BY_ENTITY_ERROR:
      return update(state, {
        [action.entity]: {
          error: { $set: action.payload }
        }
      })
    case types.PUT_PREFERENCE_BY_ENTITY_SUCCESS:
      return update(state, {
        put: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_PREFERENCE_BY_ENTITY_ERROR:
      return update(state, {
        put: {
          error: { $set: action.payload }
        }
      })
    default:
      return state
  }
}
