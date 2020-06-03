import * as types from './index'

const getBandwidthPackages = params => ({
  type: types.GET_BANDWIDTH_PACKAGES,
  params
})

const clearBandwidthPackagesResponseInfo = () => ({
  type: types.CLEAR_BANDWIDTH_PACKAGE_RESPONSE_INFO
})

const getBandwidthPackageById = id => ({
  type: types.GET_BANDWIDTH_PACKAGE_BY_ID,
  id
})

const postBandwidthPackage = data => ({
  type: types.POST_BANDWIDTH_PACKAGE,
  data
})
const putBandwidthPackage = (id, data) => ({
  type: types.PUT_BANDWIDTH_PACKAGE,
  id,
  data
})

const deleteBandwidthPackage = id => ({
  type: types.DELETE_BANDWIDTH_PACKAGE,
  id
})

const deleteSelectedBandwidthPackages = ids => ({
  type: types.DELETE_SELECTED_BANDWIDTH_PACKAGES,
  ids
})

export {
  getBandwidthPackages,
  getBandwidthPackageById,
  clearBandwidthPackagesResponseInfo,
  postBandwidthPackage,
  putBandwidthPackage,
  deleteBandwidthPackage,
  deleteSelectedBandwidthPackages
}
