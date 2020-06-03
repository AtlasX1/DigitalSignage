import { call, put, all } from 'redux-saga/effects'

import * as types from '../actions'

import { devicePackageService } from '../services'
import { transformMeta } from 'utils/tableUtils'

function* getDevicePackages({ params }) {
  try {
    const { meta, data } = yield call(
      devicePackageService.getDevicePackage,
      params
    )

    //Set the end of the download
    const modifiedMeta = transformMeta(meta)

    yield put({
      type: types.GET_DEVICE_PACKAGES_SUCCESS,
      response: data,
      modifiedMeta
    })
  } catch (error) {
    yield put({ type: types.GET_DEVICE_PACKAGES_ERROR, payload: error })
  }
}

function* getDevicePackageById({ id }) {
  try {
    const response = yield call(devicePackageService.getDevicePackageById, id)
    yield put({
      type: types.GET_DEVICE_PACKAGE_BY_ID_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GET_DEVICE_PACKAGE_BY_ID_ERROR, payload: error })
  }
}

function* postDevicePackage({ data }) {
  try {
    yield call(devicePackageService.postDevicePackage, data)
    yield put({
      type: types.POST_DEVICE_PACKAGE_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.POST_DEVICE_PACKAGE_ERROR, payload: error })
  }
}

function* putDevicePackage({ id, data }) {
  try {
    yield call(devicePackageService.putDevicePackage, id, data)
    yield put({
      type: types.PUT_DEVICE_PACKAGE_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.PUT_DEVICE_PACKAGE_ERROR, payload: error })
  }
}

function* deleteDevicePackage({ id }) {
  try {
    yield call(devicePackageService.deleteDevicePackage, id)
    yield put({
      type: types.DELETE_DEVICE_PACKAGE_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.DELETE_DEVICE_PACKAGE_ERROR, payload: error })
  }
}

function* deleteSelectedDevicePackages({ ids }) {
  try {
    yield all(ids.map(id => call(devicePackageService.deleteDevicePackage, id)))
    yield put({
      type: types.DELETE_SELECTED_DEVICE_PACKAGES_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({
      type: types.DELETE_SELECTED_DEVICE_PACKAGES_ERROR,
      payload: error
    })
  }
}

export default {
  getDevicePackages,
  getDevicePackageById,
  postDevicePackage,
  putDevicePackage,
  deleteDevicePackage,
  deleteSelectedDevicePackages
}
