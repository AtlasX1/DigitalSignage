import update from 'immutability-helper'

import * as types from 'actions'

const initialState = {
  isOpenLeftSidebar: false,
  isOpenRightSidebar: true,
  designGalleryItem: {
    status: null,
    response: null,
    error: null
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_DESIGN_GALLERY_SUCCESS:
      return update(state, {
        designGalleryItem: {
          response: { $set: action.payload }
        }
      })
    case types.GET_DESIGN_GALLERY_ERROR:
      return update(state, {
        designGalleryItem: {
          error: { $set: action.payload }
        }
      })

    case types.POST_DESIGN_GALLERY_SUCCESS:
    case types.PUT_DESIGN_GALLERY_SUCCESS:
      return update(state, {
        designGalleryItem: {
          status: { $set: 'successfully' }
        }
      })
    case types.POST_DESIGN_GALLERY_ERROR:
    case types.PUT_DESIGN_GALLERY_ERROR:
      return update(state, {
        designGalleryItem: {
          status: { $set: 'error' },
          error: { $set: action.payload }
        }
      })

    case types.CLEAR_DESIGN_GALLERY:
      return update(state, {
        designGalleryItem: {
          status: { $set: null },
          response: { $set: null },
          error: { $set: null }
        }
      })

    case types.CLEAR_DESIGN_GALLERY_STATUS:
      return update(state, {
        designGalleryItem: {
          status: { $set: null }
        }
      })

    case types.SET_OPEN_LEFT_SIDEBAR:
      return {
        ...state,
        isOpenLeftSidebar: action.data
      }

    case types.SET_OPEN_RIGHT_SIDEBAR:
      return {
        ...state,
        isOpenRightSidebar: action.data
      }

    default:
      return state
  }
}
