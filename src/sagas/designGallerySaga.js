import { call, put } from 'redux-saga/effects'

import * as types from '../actions'

import { designGalleryService } from '../services'

function* postDesignGallery(action) {
  try {
    const response = yield call(
      designGalleryService.postDesignGallery,
      action.data
    )
    yield put({
      type: types.POST_DESIGN_GALLERY_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.POST_DESIGN_GALLERY_ERROR,
      payload: error
    })
  }
}

function* putDesignGallery(action) {
  try {
    const response = yield call(designGalleryService.putDesignGallery, {
      id: action.meta.id,
      data: action.data
    })
    yield put({
      type: types.PUT_DESIGN_GALLERY_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.PUT_DESIGN_GALLERY_ERROR,
      payload: error
    })
  }
}

function* getDesignGallery(action) {
  try {
    const response = yield call(
      designGalleryService.getDesignGallery,
      action.data
    )
    yield put({
      type: types.GET_DESIGN_GALLERY_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.GET_DESIGN_GALLERY_ERROR,
      payload: error
    })
  }
}

export default {
  postDesignGallery,
  putDesignGallery,
  getDesignGallery
}
