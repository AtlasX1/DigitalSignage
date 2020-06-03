import { call, put, all } from 'redux-saga/effects'

import * as types from '../actions'

import { bandwidthPackageService } from '../services'
import { transformMeta } from 'utils/tableUtils'

function* getBandwidthPackages({ params }) {
  try {
    const { meta, data } = yield call(
      bandwidthPackageService.getBandwidthPackage,
      params
    )

    //Set the end of the download
    const modifiedMeta = transformMeta(meta)

    yield put({
      type: types.GET_BANDWIDTH_PACKAGES_SUCCESS,
      response: data,
      modifiedMeta
    })
  } catch (error) {
    yield put({ type: types.GET_BANDWIDTH_PACKAGES_ERROR, payload: error })
  }
}

function* getBandwidthPackageById({ id }) {
  try {
    const response = yield call(
      bandwidthPackageService.getBandwidthPackageById,
      id
    )
    yield put({
      type: types.GET_BANDWIDTH_PACKAGE_BY_ID_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GET_BANDWIDTH_PACKAGE_BY_ID_ERROR, payload: error })
  }
}

function* postBandwidthPackage({ data }) {
  try {
    yield call(bandwidthPackageService.postBandwidthPackage, data)
    yield put({
      type: types.POST_BANDWIDTH_PACKAGE_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.POST_BANDWIDTH_PACKAGE_ERROR, payload: error })
  }
}

function* putBandwidthPackage({ id, data }) {
  try {
    yield call(bandwidthPackageService.putBandwidthPackage, id, data)
    yield put({
      type: types.PUT_BANDWIDTH_PACKAGE_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.PUT_BANDWIDTH_PACKAGE_ERROR, payload: error })
  }
}

function* deleteBandwidthPackage({ id }) {
  try {
    yield call(bandwidthPackageService.deleteBandwidthPackage, id)
    yield put({
      type: types.DELETE_BANDWIDTH_PACKAGE_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.DELETE_BANDWIDTH_PACKAGE_ERROR, payload: error })
  }
}

function* deleteSelectedBandwidthPackages({ ids }) {
  try {
    yield all(
      ids.map(id => call(bandwidthPackageService.deleteBandwidthPackage, id))
    )
    yield put({
      type: types.DELETE_SELECTED_BANDWIDTH_PACKAGES_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({
      type: types.DELETE_SELECTED_BANDWIDTH_PACKAGES_ERROR,
      payload: error
    })
  }
}

export default {
  getBandwidthPackages,
  getBandwidthPackageById,
  postBandwidthPackage,
  putBandwidthPackage,
  deleteBandwidthPackage,
  deleteSelectedBandwidthPackages
}
