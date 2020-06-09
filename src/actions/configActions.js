import * as types from './index'

const getConfigOrgRole = () => ({
  type: types.GET_CONFIG_ORG_ROLE
})

const clearGetOrgConfigOrgRoleInfo = () => ({
  type: types.CLEAR_GET_ORG_CONFIG_ORG_ROLE_INFO
})

const getConfigEnterpriseRole = () => ({
  type: types.GET_CONFIG_ENTERPRISE_ROLE
})

const getConfigSystemRole = () => ({
  type: types.GET_CONFIG_SYSTEM_ROLE
})

const getConfigClientType = () => ({
  type: types.GET_CONFIG_CLIENT_TYPE
})

const getConfigDeviceType = () => ({
  type: types.GET_CONFIG_DEVICE_TYPE
})

const getConfigFeatureClient = () => ({
  type: types.GET_CONFIG_FEATURE_CLIENT
})

const getConfigFeatureDevice = () => ({
  type: types.GET_CONFIG_FEATURE_DEVICE
})

const getConfigFeatureMedia = () => ({
  type: types.GET_CONFIG_FEATURE_MEDIA
})

const getConfigMediaCategory = () => ({
  type: types.GET_CONFIG_MEDIA_CATEGORY
})

const getThemeOfMediaFeatureById = id => ({
  type: types.GET_THEME_OF_MEDIA_FEATURE_BY_ID,
  id
})

const clearMediaThemes = () => ({
  type: types.CLEAR_THEME_OF_MEDIA
})

const getContentSourceOfMediaFeatureById = id => ({
  type: types.GET_CONTENT_SOURCE_OF_MEDIA_FEATURE_BY_ID,
  id
})

const getAlertTypesAction = () => ({
  type: types.GET_CONFIG_ALERT_TYPES
})

const clearGetAlertTypesInfoAction = () => ({
  type: types.CLEAR_GET_CONFIG_ALERT_TYPES_INFO
})

const getLocation = data => ({
  type: types.GET_LOCATION,
  data
})

const getTransitions = () => ({
  type: types.GET_CONFIG_TRANSITIONS
})

const getAirlines = params => ({
  type: types.GET_AIRLINES,
  params
})

const getAirports = params => ({
  type: types.GET_AIRPORTS,
  params
})

const getLocationInfo = location => ({
  type: types.GET_LOCATION_INFO,
  location
})

const clearMediaContentSource = location => ({
  type: types.CLEAR_MEDIA_CONTENT_SOURCE,
  location
})

const getBackgroundPattern = () => ({
  type: types.GET_BACKGROUND_PATTERNS
})

const getBackgroundImagesFromMedia = params => ({
  type: types.GET_BACKGROUND_IMAGES_FROM_MEDIA,
  params
})

export {
  getConfigOrgRole,
  clearGetOrgConfigOrgRoleInfo,
  getConfigEnterpriseRole,
  getConfigSystemRole,
  getConfigClientType,
  getConfigDeviceType,
  getConfigFeatureClient,
  getConfigFeatureDevice,
  getConfigFeatureMedia,
  getConfigMediaCategory,
  getThemeOfMediaFeatureById,
  getContentSourceOfMediaFeatureById,
  getLocation,
  clearMediaThemes,
  getTransitions,
  getAlertTypesAction,
  clearGetAlertTypesInfoAction,
  getAirlines,
  getAirports,
  getLocationInfo,
  clearMediaContentSource,
  getBackgroundPattern,
  getBackgroundImagesFromMedia
}
