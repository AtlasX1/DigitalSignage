import {
  CLIENT_PACKAGE,
  DEVICE_PACKAGE,
  BANDWIDTH_PACKAGE
} from '../../../../constants/packageConstants'

import {
  getClientPackages,
  getClientPackageById,
  clearClientPackagesResponseInfo,
  postClientPackages,
  putClientPackage,
  deleteClientPackage,
  deleteSelectedClientPackages
} from '../../../../actions/clientPackagesActions'

import {
  getBandwidthPackages,
  getBandwidthPackageById,
  clearBandwidthPackagesResponseInfo,
  postBandwidthPackage,
  putBandwidthPackage,
  deleteBandwidthPackage,
  deleteSelectedBandwidthPackages
} from '../../../../actions/bandwidthPackageActions'

import {
  getConfigFeatureClient,
  getConfigFeatureDevice
} from '../../../../actions/configActions'

import {
  getDevicePackages,
  getDevicePackageById,
  clearDevicePackagesResponseInfo,
  postDevicePackage,
  putDevicePackage,
  deleteDevicePackage,
  deleteSelectedDevicePackages
} from '../../../../actions/devicePackageActions'

const packageActions = {
  getClientPackages,
  getClientPackageById,
  clearClientPackagesResponseInfo,
  postClientPackages,
  putClientPackage,
  deleteClientPackage,
  deleteSelectedClientPackages,

  getDevicePackages,
  getDevicePackageById,
  clearDevicePackagesResponseInfo,
  postDevicePackage,
  putDevicePackage,
  deleteDevicePackage,
  deleteSelectedDevicePackages,

  getBandwidthPackages,
  getBandwidthPackageById,
  clearBandwidthPackagesResponseInfo,
  postBandwidthPackage,
  putBandwidthPackage,
  deleteBandwidthPackage,
  deleteSelectedBandwidthPackages,

  getConfigFeatureClient,
  getConfigFeatureDevice
}

const getGroupsActionsWithBindActionCreators = function () {
  return {
    [CLIENT_PACKAGE]: {
      getItems: this.getClientPackages,
      getItemById: this.getClientPackageById,
      clearResponseInfo: this.clearClientPackagesResponseInfo,
      postItem: this.postClientPackages,
      putItem: this.putClientPackage,
      deleteItem: this.deleteClientPackage,
      deleteSelectedItems: this.deleteSelectedClientPackages
    },
    [DEVICE_PACKAGE]: {
      getItems: this.getDevicePackages,
      getItemById: this.getDevicePackageById,
      clearResponseInfo: this.clearDevicePackagesResponseInfo,
      postItem: this.postDevicePackage,
      putItem: this.putDevicePackage,
      deleteItem: this.deleteDevicePackage,
      deleteSelectedItems: this.deleteSelectedDevicePackages
    },
    [BANDWIDTH_PACKAGE]: {
      getItems: this.getBandwidthPackages,
      getItemById: this.getBandwidthPackageById,
      clearResponseInfo: this.clearBandwidthPackagesResponseInfo,
      postItem: this.postBandwidthPackage,
      putItem: this.putBandwidthPackage,
      deleteItem: this.deleteBandwidthPackage,
      deleteSelectedItems: this.deleteSelectedBandwidthPackages
    }
  }
}
const columns = {
  [CLIENT_PACKAGE]: [
    { id: 'title', label: 'Name', active: true },
    { id: 'bandwidth', label: 'Bandwidth', active: true }
  ],
  [DEVICE_PACKAGE]: [{ id: 'title', label: 'Name', active: true }],
  [BANDWIDTH_PACKAGE]: [
    { id: 'title', label: 'Name', active: true },
    { id: 'bandwidth', label: 'Bandwidth', active: true },
    { id: 'amount', label: 'Amount', active: true }
  ]
}

export { getGroupsActionsWithBindActionCreators, packageActions, columns }
