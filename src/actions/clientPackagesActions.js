import * as types from './index'

const getClientPackages = params => ({
  type: types.GET_CLIENT_PACKAGES,
  params
})

const clearClientPackagesResponseInfo = () => ({
  type: types.CLEAR_CLIENT_PACKAGE_RESPONSE_INFO
})

const getClientPackageById = id => ({
  type: types.GET_CLIENT_PACKAGE_BY_ID,
  id
})

const postClientPackages = data => ({
  type: types.POST_CLIENT_PACKAGE,
  data
})
const putClientPackage = (id, data) => ({
  type: types.PUT_CLIENT_PACKAGE,
  id,
  data
})

const deleteClientPackage = id => ({
  type: types.DELETE_CLIENT_PACKAGE,
  id
})

const deleteSelectedClientPackages = ids => ({
  type: types.DELETE_SELECTED_CLIENT_PACKAGES,
  ids
})

export {
  getClientPackages,
  getClientPackageById,
  clearClientPackagesResponseInfo,
  postClientPackages,
  putClientPackage,
  deleteClientPackage,
  deleteSelectedClientPackages
}
