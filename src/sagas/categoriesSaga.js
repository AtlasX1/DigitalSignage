import { call, put } from 'redux-saga/effects'
import * as types from 'actions'
import { categoriesService } from 'services'
import { transformMeta } from 'utils/tableUtils'

function* getCategoriesByFeature({ feature, params }) {
  try {
    const { data, meta } = yield call(
      categoriesService.getCategoriesByFeature,
      feature,
      params
    )

    const modifiedMeta = transformMeta(meta)

    yield put({
      type: types.GET_CATEGORIES_BY_FEATURE_SUCCESS,
      key: feature,
      payload: data,
      modifiedMeta
    })
  } catch (error) {
    yield put({
      type: types.GET_CATEGORIES_BY_FEATURE_ERROR,
      key: feature,
      payload: error
    })
  }
}

function* postCategoryIntoFeature({ feature, data }) {
  try {
    yield call(categoriesService.postCategoryIntoFeature, feature, data)
    yield put({
      type: types.POST_CATEGORY_INTO_FEATURE_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({
      type: types.POST_CATEGORY_INTO_FEATURE_ERROR,
      payload: error
    })
  }
}

function* getCategoryById({ id }) {
  try {
    const response = yield call(categoriesService.getCategoryById, id)
    yield put({
      type: types.GET_CATEGORY_BY_ID_SUCCESS,
      payload: response,
      key: id
    })
  } catch (error) {
    yield put({
      type: types.GET_CATEGORY_BY_ID_ERROR,
      payload: error
    })
  }
}

function* putCategory({ id, data }) {
  try {
    yield call(categoriesService.putCategory, id, data)
    yield put({
      type: types.PUT_CATEGORY_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({
      type: types.PUT_CATEGORY_ERROR,
      payload: error
    })
  }
}

function* deleteCategory({ id }) {
  try {
    yield call(categoriesService.deleteCategory, id)
    yield put({
      type: types.DELETE_CATEGORY_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({
      type: types.DELETE_CATEGORY_ERROR,
      payload: error
    })
  }
}

export default {
  getCategoriesByFeature,
  postCategoryIntoFeature,
  getCategoryById,
  putCategory,
  deleteCategory
}
