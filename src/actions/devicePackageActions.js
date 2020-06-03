import * as types from './index'

const getDevicePackages = params => ({
  type: types.GET_DEVICE_PACKAGES,
  params
})

const clearDevicePackagesResponseInfo = () => ({
  type: types.CLEAR_DEVICE_PACKAGE_RESPONSE_INFO
})

const getDevicePackageById = id => ({
  type: types.GET_DEVICE_PACKAGE_BY_ID,
  id
})

const postDevicePackage = data => ({
  type: types.POST_DEVICE_PACKAGE,
  data
})

const putDevicePackage = (id, data) => ({
  type: types.PUT_DEVICE_PACKAGE,
  id,
  data
})

const deleteDevicePackage = id => ({
  type: types.DELETE_DEVICE_PACKAGE,
  id
})

const deleteSelectedDevicePackages = ids => ({
  type: types.DELETE_SELECTED_DEVICE_PACKAGES,
  ids
})

export {
  getDevicePackages,
  getDevicePackageById,
  clearDevicePackagesResponseInfo,
  postDevicePackage,
  putDevicePackage,
  deleteDevicePackage,
  deleteSelectedDevicePackages
}
