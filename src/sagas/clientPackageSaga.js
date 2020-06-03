import { call, put, all } from 'redux-saga/effects'

import * as types from '../actions'

import { clientPackageService } from '../services'
import { transformMeta } from 'utils/tableUtils'

function* getClientPackages({ params }) {
  try {
    const { meta, data } = yield call(
      clientPackageService.getClientPackage,
      params
    )

    //Set the end of the download
    const modifiedMeta = transformMeta(meta)

    yield put({
      type: types.GET_CLIENT_PACKAGES_SUCCESS,
      response: data,
      modifiedMeta
    })
  } catch (error) {
    yield put({ type: types.GET_CLIENT_PACKAGES_ERROR, payload: error })
  }
}

function* getClientPackageById({ id }) {
  try {
    const response = yield call(clientPackageService.getClientPackageById, id)
    yield put({
      type: types.GET_CLIENT_PACKAGE_BY_ID_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GET_CLIENT_PACKAGE_BY_ID_ERROR, payload: error })
  }
}

function* postClientPackage({ data }) {
  try {
    yield call(clientPackageService.postClientPackage, data)
    yield put({
      type: types.POST_CLIENT_PACKAGE_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.POST_CLIENT_PACKAGE_ERROR, payload: error })
  }
}

function* putClientPackage({ id, data }) {
  try {
    yield call(clientPackageService.putClientPackage, id, data)
    yield put({
      type: types.PUT_CLIENT_PACKAGE_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.PUT_CLIENT_PACKAGE_ERROR, payload: error })
  }
}

function* deleteClientPackage({ id }) {
  try {
    yield call(clientPackageService.deleteClientPackage, id)
    yield put({
      type: types.DELETE_CLIENT_PACKAGE_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.DELETE_CLIENT_PACKAGE_ERROR, payload: error })
  }
}

function* deleteSelectedClientPackages({ ids }) {
  try {
    yield all(ids.map(id => call(clientPackageService.deleteClientPackage, id)))
    yield put({
      type: types.DELETE_SELECTED_CLIENT_PACKAGES_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({
      type: types.DELETE_SELECTED_CLIENT_PACKAGES_ERROR,
      payload: error
    })
  }
}

export default {
  getClientPackages,
  getClientPackageById,
  postClientPackage,
  putClientPackage,
  deleteClientPackage,
  deleteSelectedClientPackages
}
