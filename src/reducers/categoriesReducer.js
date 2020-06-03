import update from 'immutability-helper'
import featureConstants from 'constants/featureConstants'
import * as types from 'actions'

const shapeOfBody = {
  response: [],
  error: {}
}

const shapeOfBodyWithMeta = {
  ...shapeOfBody,
  meta: {
    currentPage: 1,
    from: 0,
    lastPage: 0,
    perPage: 0,
    to: 0,
    total: 0,
    count: 0,
    isLoading: true
  }
}

const structureCategories = Object.keys(featureConstants).reduce(
  (accum, key) => ({
    ...accum,
    [featureConstants[key]]: {
      ...shapeOfBodyWithMeta
    }
  }),
  {}
)

const deleteInitialState = {
  ...shapeOfBody,
  label: 'delete'
}

const postInitialState = {
  ...shapeOfBody,
  label: 'add'
}

const putInitialState = {
  ...shapeOfBody,
  label: 'update'
}

const initialState = {
  categoriesByFeature: {
    ...structureCategories
  },
  categoryById: {},
  del: {
    ...deleteInitialState
  },
  put: {
    ...putInitialState
  },
  post: {
    ...postInitialState
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_CATEGORIES_BY_FEATURE_SUCCESS:
      return update(state, {
        categoriesByFeature: {
          [action.key]: {
            response: { $set: action.payload },
            meta: { $set: action.modifiedMeta }
          }
        }
      })
    case types.GET_CATEGORIES_BY_FEATURE_ERROR:
      return update(state, {
        categoriesByFeature: {
          [action.key]: {
            error: { $set: action.payload }
          }
        }
      })
    case types.GET_CATEGORY_BY_ID_SUCCESS:
      return update(state, {
        categoryById: {
          [action.key]: { $set: { response: action.payload } }
        }
      })
    case types.GET_CATEGORY_BY_ID_ERROR:
      return update(state, {
        categoryById: {
          [action.key]: { $set: { error: action.payload } }
        }
      })
    case types.POST_CATEGORY_INTO_FEATURE_SUCCESS:
      return update(state, {
        post: {
          response: { $set: action.payload }
        }
      })
    case types.POST_CATEGORY_INTO_FEATURE_ERROR:
      return update(state, {
        post: {
          error: { $set: action.payload }
        }
      })
    case types.PUT_CATEGORY_SUCCESS:
      return update(state, {
        put: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_CATEGORY_ERROR:
      return update(state, {
        put: {
          error: { $set: action.payload }
        }
      })
    case types.DELETE_CATEGORY_SUCCESS:
      return update(state, {
        del: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_CATEGORY_ERROR:
      return update(state, {
        del: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_CATEGORY_RESPONSE_INFO:
      return update(state, {
        del: {
          $set: { ...deleteInitialState }
        },
        post: {
          $set: { ...postInitialState }
        },
        put: {
          $set: { ...putInitialState }
        }
      })
    default:
      return state
  }
}
