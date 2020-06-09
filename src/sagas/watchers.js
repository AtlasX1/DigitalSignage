import { takeLatest, all, takeEvery } from 'redux-saga/effects'
import {
  loginOktaSaga,
  loginSaga,
  logoutSaga,
  updateTokenSaga,
  recoverySaga,
  resetSaga,
  impersonateSaga
} from 'sagas/authenticationSaga'
import userSaga from './userSaga'
import mediaSaga from './mediaSaga'
import playlistSaga from './playlistSaga'
import templateSaga from './templateSaga'
import scheduleSaga from './scheduleSaga'
import deviceSaga from './deviceSaga'
import reportSaga from './reportSaga'
import clientSaga from './clientSaga'
import usersSaga from './usersSaga'
import tagsSaga from './tagsSaga'
import fontsSaga from './fontsSaga'
import feedbackSaga from './feedbackSaga'
import dashboardSaga from './dashboardSaga'
import groupSaga from './groupSaga'
import configSaga from './configSaga'
import clientSettingsSaga from './clientSettingsSaga'
import settingsSaga from './settingsSaga'
import clientPackageSaga from './clientPackageSaga'
import HTMLContentSaga from './HTMLContentSaga'
import bannerSaga from './bannerSaga'
import devicePackageSaga from './devicePackageSaga'
import * as types from '../actions'
import bandwidthPackageSaga from './bandwidthPackageSaga'
import emailTemplateSaga from './emailTemplateSaga'
import customEmailTemplateSaga from './customEmailTemplateSaga'
import helpSaga from './helpSaga'
import categoriesSaga from './categoriesSaga'
import contentsSaga from './contentsSaga'
import roleSaga from './roleSaga'
import workplacePosterSaga from './workplacePosterSaga'
import preferenceSaga from './preferenceSaga'
import clientUsersSaga from './clientUsersSaga'
import whiteLabelSaga from './whiteLabelSaga'
import smartPlaylistSaga from './smartPlaylistSaga'
import quoteSaga from './quoteSaga'
import alertSaga from './alertSaga'
import designGallerySaga from './designGallerySaga'

export function* watchUserAuthentication() {
  yield takeLatest(types.LOGIN_USER, loginSaga)
}

export function* watchOktaAuthentication() {
  yield takeLatest(types.LOGIN_USER_OKTA, loginOktaSaga)
}

export function* watchUser() {
  yield all([
    takeLatest(types.GET_USER_DETAILS, userSaga.getDetails),
    takeLatest(types.PUT_USER_DETAILS, userSaga.putDetails)
  ])
}

export function* watchUserLogout() {
  yield takeLatest(types.LOGOUT_USER, logoutSaga)
}

export function* watchUpdateToken() {
  yield takeLatest(types.UPDATE_USER_TOKEN, updateTokenSaga)
}

export function* watchRecovery() {
  yield takeLatest(types.RECOVERY_USER, recoverySaga)
}

export function* watchReset() {
  yield takeLatest(types.RESET_PASSWORD, resetSaga)
}

export function* watchImpersonateUser() {
  yield takeLatest(types.IMPERSONATE_USER, impersonateSaga)
}

export function* watchMedia() {
  yield all([
    takeLatest(types.GET_MEDIA_ITEMS, mediaSaga.getItems),
    takeLatest(types.GET_MEDIA_PREFERENCE, mediaSaga.getPreference),
    takeLatest(types.PUT_MEDIA_PREFERENCE, mediaSaga.putPreference),
    takeLatest(types.GET_MEDIA_GROUPS, mediaSaga.getGroups),
    takeLatest(types.ADD_MEDIA, mediaSaga.addMedia),
    takeLatest(types.GET_MEDIA_PREVIEW, mediaSaga.getMediaPreview),
    takeLatest(types.GENERATE_MEDIA_PREVIEW, mediaSaga.generateMediaPreview),
    takeLatest(types.GET_MEDIA_GROUP_ITEMS, mediaSaga.getGroupItems),
    takeLatest(types.POST_MEDIA_GROUP_ITEM, mediaSaga.postGroupItem),
    takeLatest(types.DELETE_MEDIA_GROUP_ITEM, mediaSaga.deleteGroupItem),
    takeLatest(types.GET_MEDIA_ITEM_BY_ID, mediaSaga.getMediaItemById),
    takeLatest(types.PUT_MEDIA, mediaSaga.putMediaItemById),
    takeLatest(types.GET_FEATURE_MEDIA_ITEMS, mediaSaga.getFeatureMediaItems),
    takeEvery(types.REQUEST_MEDIA_CAP_ALERT, mediaSaga.getMediaCapAlertWorker)
  ])
}

export function* watchPlaylist() {
  yield all([
    takeLatest(types.POST_PLAYLIST, playlistSaga.addPlaylist),
    takeLatest(types.PUT_PLAYLIST, playlistSaga.putPlaylistById),
    takeLatest(types.DELETE_PLAYLIST, playlistSaga.deletePlaylistById),
    takeLatest(
      types.DELETE_SELECTED_PLAYLIST,
      playlistSaga.deleteSelectedPlaylist
    ),
    takeLatest(types.GET_PLAYLIST_BY_ID, playlistSaga.getPlaylistById),
    takeLatest(types.GET_PLAYLIST_ITEMS, playlistSaga.getItems),
    takeLatest(types.GET_PLAYLIST_PREFERENCE, playlistSaga.getPreference),
    takeLatest(types.PUT_PLAYLIST_PREFERENCE, playlistSaga.putPreference),
    takeLatest(types.GET_PLAYLIST_GROUPS, playlistSaga.getGroups),
    takeLatest(types.GET_PLAYLIST_GROUP_ITEMS, playlistSaga.getGroupItems),
    takeLatest(types.POST_PLAYLIST_GROUP_ITEM, playlistSaga.postGroupItem),
    takeLatest(types.DELETE_PLAYLIST_GROUP_ITEM, playlistSaga.deleteGroupItem),
    takeLatest(types.CLONE_PLAYLIST, playlistSaga.clonePlaylist)
  ])
}

export function* watchTemplate() {
  yield all([
    takeLatest(types.POST_TEMPLATE, templateSaga.postTemplate),
    takeLatest(types.GET_TEMPLATE, templateSaga.getTemplate),
    takeLatest(types.PUT_TEMPLATE, templateSaga.editTemplate),
    takeLatest(types.GET_TEMPLATE_ITEMS, templateSaga.getItems),
    takeLatest(types.GET_TEMPLATE_PREFERENCE, templateSaga.getPreference),
    takeLatest(types.PUT_TEMPLATE_PREFERENCE, templateSaga.putPreference),
    takeLatest(types.GET_TEMPLATE_GROUPS, templateSaga.getGroups),
    takeLatest(types.GET_TEMPLATE_GROUP_ITEMS, templateSaga.getGroupItems),
    takeLatest(types.POST_TEMPLATE_GROUP_ITEM, templateSaga.postGroupItem),
    takeLatest(types.DELETE_TEMPLATE_GROUP_ITEM, templateSaga.deleteGroupItem),
    takeLatest(types.CLONE_TEMPLATE, templateSaga.cloneTemplate),
    takeLatest(
      types.DELETE_SELECTED_TEMPLATE,
      templateSaga.deleteSelectedTemplate
    ),
    takeLatest(types.DELETE_TEMPLATE, templateSaga.deleteTemplateById)
  ])
}

export function* watchSchedule() {
  yield all([
    takeLatest(types.POST_SCHEDULE, scheduleSaga.postSchedule),
    takeLatest(types.GET_SCHEDULE_BY_ID, scheduleSaga.getSchedule),
    takeLatest(types.PUT_SCHEDULE, scheduleSaga.editSchedule),
    takeLatest(types.GET_SCHEDULE_ITEMS, scheduleSaga.getItems),
    takeLatest(types.GET_SCHEDULE_PREFERENCE, scheduleSaga.getPreference),
    takeLatest(types.PUT_SCHEDULE_PREFERENCE, scheduleSaga.putPreference),
    takeLatest(types.GET_SCHEDULE_GROUPS, scheduleSaga.getGroups),
    takeLatest(types.GET_SCHEDULE_GROUP_ITEMS, scheduleSaga.getGroupItems),
    takeLatest(types.POST_SCHEDULE_GROUP_ITEM, scheduleSaga.postGroupItem),
    takeLatest(types.DELETE_SCHEDULE_GROUP_ITEM, scheduleSaga.deleteGroupItem),
    takeLatest(
      types.DELETE_SELECTED_SCHEDULES,
      scheduleSaga.deleteSelectedSchedules
    ),
    takeLatest(types.CLONE_SCHEDULE, scheduleSaga.cloneSchedule),
    takeLatest(types.DELETE_SCHEDULE, scheduleSaga.deleteScheduleById)
  ])
}

export function* watchDevice() {
  yield all([
    takeLatest(types.GET_DEVICE_ITEMS, deviceSaga.getItems),
    takeLatest(types.GET_DEVICE_PREFERENCE, deviceSaga.getPreference),
    takeLatest(types.PUT_DEVICE_PREFERENCE, deviceSaga.putPreference),
    takeLatest(types.GET_DEVICE_GROUPS, deviceSaga.getGroups),
    takeLatest(types.PUT_DEVICE_ITEM, deviceSaga.putItem),
    takeLatest(types.GET_DEVICE_ITEM, deviceSaga.getItem),
    takeLatest(types.GET_DEVICE_PREVIEW, deviceSaga.getPreview),
    takeLatest(types.GET_DEVICE_GROUP_ITEMS, deviceSaga.getGroupItems),
    takeLatest(types.POST_DEVICE_GROUP_ITEM, deviceSaga.postGroupItem),
    takeLatest(types.DELETE_DEVICE_GROUP_ITEM, deviceSaga.deleteGroupItem),
    takeLatest(types.GET_DEVICE_REBOOT, deviceSaga.getReboot),
    takeLatest(types.PUT_DEVICE_REBOOT, deviceSaga.putReboot),
    takeLatest(types.GET_DEVICE_SLEEP_MODE, deviceSaga.getSleepMode),
    takeLatest(types.PUT_DEVICE_SLEEP_MODE, deviceSaga.putSleepMode),
    takeLatest(types.GET_DEVICE_NOTES, deviceSaga.getDeviceNotes),
    takeLatest(types.POST_DEVICE_NOTE, deviceSaga.postDeviceNote),
    takeEvery(
      types.REQUEST_CAP_ALERT_DEVICES,
      deviceSaga.getCapAlertDevicesWorker
    )
  ])
}
export function* watchReport() {
  yield all([takeLatest(types.GET_REPORT_ITEMS, reportSaga.getItems)])
}

export function* watchClient() {
  yield all([
    takeLatest(types.GET_CLIENTS, clientSaga.getClients),
    takeLatest(types.GET_CLIENT_BY_ID, clientSaga.getClientById),
    takeLatest(types.POST_CLIENT, clientSaga.postClient),
    takeLatest(types.PUT_CLIENT, clientSaga.putClient),
    takeLatest(types.GET_CLIENT_GROUP_ITEMS, clientSaga.getGroupItems),
    takeLatest(types.POST_CLIENT_GROUP_ITEM, clientSaga.postGroupItem),
    takeLatest(types.DELETE_CLIENT_GROUP_ITEM, clientSaga.deleteGroupItem),
    takeLatest(types.GET_CLIENT_NOTES, clientSaga.getClientNotes),
    takeLatest(types.POST_CLIENT_NOTE, clientSaga.postClientNote)
  ])
}

export function* watchUsers() {
  yield all([
    takeLatest(types.GET_USERS_ITEMS, usersSaga.getItems),
    takeLatest(types.POST_USERS_ITEM, usersSaga.postItem),
    takeLatest(types.DELETE_USERS_ITEM, usersSaga.deleteItem),
    takeLatest(types.DELETE_SELECTED_USERS, usersSaga.deleteSelectedItems),
    takeLatest(types.GET_USERS_ITEM, usersSaga.getItem),
    takeLatest(types.PUT_USERS_ITEM, usersSaga.putItem),
    takeLatest(types.GET_USERS_GROUPS, usersSaga.getGroups),
    takeLatest(types.GET_UNGROUPED_USERS, usersSaga.getUngroupedUsers),
    takeLatest(types.GET_USERS_GROUP_ITEMS, usersSaga.getUsersGroupItems),
    takeLatest(types.POST_USERS_GROUP_ITEM, usersSaga.postUsersGroupItem),
    takeLatest(types.DELETE_USERS_GROUP_ITEM, usersSaga.deleteUsersGroupItem),
    takeEvery(types.GET_USERS_PERMISSION, usersSaga.getUsersPermission),
    takeLatest(types.PUT_USERS_PERMISSION, usersSaga.putUsersPermission),
    takeEvery(
      types.GET_USERS_GROUP_PERMISSION,
      usersSaga.getUsersGroupPermission
    ),
    takeLatest(
      types.PUT_USERS_GROUP_PERMISSION,
      usersSaga.putUsersGroupPermission
    )
  ])
}

export function* watchClientUsers() {
  yield all([
    takeLatest(types.GET_CLIENT_USERS_ITEMS, clientUsersSaga.getItems),
    takeLatest(types.POST_CLIENT_USERS_ITEM, clientUsersSaga.postItem),
    takeLatest(types.DELETE_CLIENT_USERS_ITEM, clientUsersSaga.deleteItem),
    takeLatest(
      types.DELETE_SELECTED_CLIENT_USERS,
      clientUsersSaga.deleteSelectedItems
    ),
    takeLatest(types.GET_CLIENT_USERS_ITEM, clientUsersSaga.getItem),
    takeLatest(types.PUT_CLIENT_USERS_ITEM, clientUsersSaga.putItem)
  ])
}

export function* watchFeedback() {
  yield all([takeLatest(types.POST_FEEDBACK, feedbackSaga.postInfo)])
}

export function* watchDashboard() {
  yield all([
    takeLatest(types.GET_DASHBOARD_INFO, dashboardSaga.getInfo),
    takeLatest(types.PUT_DASHBOARD_INFO, dashboardSaga.putInfo)
  ])
}

export function* watchTags() {
  yield all([
    takeLatest(types.GET_TAGS, tagsSaga.getTags),
    takeLatest(types.GET_TAG_BY_ID, tagsSaga.getTagById),
    takeLatest(types.POST_TAG, tagsSaga.postTag),
    takeLatest(types.PUT_TAG, tagsSaga.putTag),
    takeLatest(types.DELETE_SELECTED_TAGS, tagsSaga.deleteSelectedTags),
    takeLatest(types.DELETE_TAG, tagsSaga.deleteTag)
  ])
}

export function* watchGroups() {
  yield all([
    takeLatest(types.GET_GROUPS_BY_ENTITY, groupSaga.getGroupByEntity),
    takeLatest(types.POST_GROUP, groupSaga.postGroup),
    takeLatest(types.DELETE_GROUP, groupSaga.deleteGroup),
    takeLatest(types.PUT_GROUP, groupSaga.putGroup),
    takeLatest(types.GET_GROUP_PERMISSION, groupSaga.getGroupPermission),
    takeLatest(types.PUT_GROUP_PERMISSION, groupSaga.putGroupPermission)
  ])
}

export function* watchConfig() {
  yield all([
    takeLatest(types.GET_CONFIG_ORG_ROLE, configSaga.getConfigOrgRole),
    takeLatest(
      types.GET_CONFIG_ENTERPRISE_ROLE,
      configSaga.getConfigEnterpriseRole
    ),
    takeLatest(types.GET_CONFIG_SYSTEM_ROLE, configSaga.getConfigSystemRole),
    takeLatest(types.GET_CONFIG_CLIENT_TYPE, configSaga.getConfigClientType),
    takeLatest(types.GET_CONFIG_DEVICE_TYPE, configSaga.getConfigDeviceType),
    takeLatest(
      types.GET_CONFIG_FEATURE_CLIENT,
      configSaga.getConfigFeatureClient
    ),
    takeLatest(
      types.GET_CONFIG_FEATURE_DEVICE,
      configSaga.getConfigFeatureDevice
    ),
    takeLatest(
      types.GET_CONFIG_FEATURE_MEDIA,
      configSaga.getConfigFeatureMedia
    ),
    takeLatest(
      types.GET_CONFIG_MEDIA_CATEGORY,
      configSaga.getConfigMediaCategory
    ),
    takeLatest(
      types.GET_THEME_OF_MEDIA_FEATURE_BY_ID,
      configSaga.getThemeOfMediaFeatureById
    ),
    takeLatest(
      types.GET_CONTENT_SOURCE_OF_MEDIA_FEATURE_BY_ID,
      configSaga.getContentSourceOfMediaFeatureById
    ),
    takeLatest(types.GET_LOCATION, configSaga.getLocation),
    takeLatest(types.GET_CONFIG_TRANSITIONS, configSaga.getTransitions),
    takeLatest(types.GET_CONFIG_ALERT_TYPES, configSaga.getAlertTypes),
    takeLatest(types.GET_AIRLINES, configSaga.getAirlines),
    takeLatest(types.GET_AIRPORTS, configSaga.getAirports),
    takeLatest(types.GET_CONFIG_ALERT_TYPES, configSaga.getAlertTypes),
    takeLatest(types.GET_LOCATION_INFO, configSaga.getLocationInfo),
    takeLatest(types.GET_BACKGROUND_PATTERNS, configSaga.getBackgroundPattern),
    takeLatest(
      types.GET_BACKGROUND_IMAGES_FROM_MEDIA,
      configSaga.getBackgroundImagesFromMedia
    )
  ])
}

export function* watchFonts() {
  yield all([
    takeLatest(types.GET_GOOGLE_FONTS, fontsSaga.getGoogleFonts),
    takeLatest(types.GET_SAVED_FONTS, fontsSaga.getSavedFonts),
    takeLatest(types.GET_FONTS, fontsSaga.getFonts),
    takeLatest(types.DELETE_FONT, fontsSaga.deleteFont),
    takeLatest(types.POST_FONT, fontsSaga.postFont)
  ])
}

export function* watchClientSettings() {
  yield all([
    takeLatest(types.GET_USER_SETTINGS, clientSettingsSaga.getClientSettings),
    takeLatest(types.PUT_CLIENT_SETTINGS, clientSettingsSaga.putClientSettings)
  ])
}

export function* watchSettings() {
  yield all([
    takeLatest(types.GET_SETTINGS, settingsSaga.getSettings),
    takeLatest(types.PUT_SETTINGS, settingsSaga.putSettings)
  ])
}

export function* watchHTMLContent() {
  yield all([
    takeLatest(types.GET_HTML_CONTENTS, HTMLContentSaga.getHTMLContents),
    takeLatest(types.POST_HTML_CONTENT, HTMLContentSaga.postHTMLContent),
    takeLatest(types.DELETE_HTML_CONTENT, HTMLContentSaga.deleteHTMLContent),
    takeLatest(
      types.DELETE_SELECTED_HTML_CONTENTS,
      HTMLContentSaga.deleteSelectedHTMLContents
    ),
    takeLatest(types.GET_HTML_CONTENT_BY_ID, HTMLContentSaga.getHTMLContent),
    takeLatest(types.PUT_HTML_CONTENT, HTMLContentSaga.putHTMLContent)
  ])
}

export function* watchBanners() {
  yield all([
    takeLatest(types.GET_BANNERS, bannerSaga.getBanners),
    takeLatest(types.GET_BANNER_BY_ID, bannerSaga.getBannerById),
    takeLatest(types.POST_BANNER, bannerSaga.postBanner),
    takeLatest(types.PUT_BANNER, bannerSaga.putBanner),
    takeLatest(types.DELETE_SELECTED_BANNERS, bannerSaga.deleteSelectedBanners),
    takeLatest(types.DELETE_BANNER, bannerSaga.deleteBanner)
  ])
}

export function* watchClientPackage() {
  yield all([
    takeLatest(types.GET_CLIENT_PACKAGES, clientPackageSaga.getClientPackages),
    takeLatest(
      types.GET_CLIENT_PACKAGE_BY_ID,
      clientPackageSaga.getClientPackageById
    ),
    takeLatest(types.POST_CLIENT_PACKAGE, clientPackageSaga.postClientPackage),
    takeLatest(types.PUT_CLIENT_PACKAGE, clientPackageSaga.putClientPackage),
    takeLatest(
      types.DELETE_SELECTED_CLIENT_PACKAGES,
      clientPackageSaga.deleteSelectedClientPackages
    ),
    takeLatest(
      types.DELETE_CLIENT_PACKAGE,
      clientPackageSaga.deleteClientPackage
    )
  ])
}

export function* watchDevicePackage() {
  yield all([
    takeLatest(types.GET_DEVICE_PACKAGES, devicePackageSaga.getDevicePackages),
    takeLatest(
      types.GET_DEVICE_PACKAGE_BY_ID,
      devicePackageSaga.getDevicePackageById
    ),
    takeLatest(types.POST_DEVICE_PACKAGE, devicePackageSaga.postDevicePackage),
    takeLatest(types.PUT_DEVICE_PACKAGE, devicePackageSaga.putDevicePackage),
    takeLatest(
      types.DELETE_SELECTED_DEVICE_PACKAGES,
      devicePackageSaga.deleteSelectedDevicePackages
    ),
    takeLatest(
      types.DELETE_DEVICE_PACKAGE,
      devicePackageSaga.deleteDevicePackage
    )
  ])
}

export function* watchBandwidthPackage() {
  yield all([
    takeLatest(
      types.GET_BANDWIDTH_PACKAGES,
      bandwidthPackageSaga.getBandwidthPackages
    ),
    takeLatest(
      types.GET_BANDWIDTH_PACKAGE_BY_ID,
      bandwidthPackageSaga.getBandwidthPackageById
    ),
    takeLatest(
      types.POST_BANDWIDTH_PACKAGE,
      bandwidthPackageSaga.postBandwidthPackage
    ),
    takeLatest(
      types.PUT_BANDWIDTH_PACKAGE,
      bandwidthPackageSaga.putBandwidthPackage
    ),
    takeLatest(
      types.DELETE_SELECTED_BANDWIDTH_PACKAGES,
      bandwidthPackageSaga.deleteSelectedBandwidthPackages
    ),
    takeLatest(
      types.DELETE_BANDWIDTH_PACKAGE,
      bandwidthPackageSaga.deleteBandwidthPackage
    )
  ])
}

export function* watchEmailTemplate() {
  yield all([
    takeLatest(types.GET_EMAIL_TEMPLATES, emailTemplateSaga.getEmailTemplates),
    takeLatest(
      types.GET_EMAIL_TEMPLATE_BY_ID,
      emailTemplateSaga.getEmailTemplateById
    ),
    takeLatest(types.PUT_EMAIL_TEMPLATE, emailTemplateSaga.putEmailTemplate)
  ])
}

export function* watchCustomEmailTemplate() {
  yield all([
    takeLatest(
      types.GET_CUSTOM_EMAIL_TEMPLATES,
      customEmailTemplateSaga.getCustomEmailTemplates
    ),
    takeLatest(
      types.GET_CUSTOM_EMAIL_TEMPLATE_BY_ID,
      customEmailTemplateSaga.getCustomEmailTemplateById
    ),
    takeLatest(
      types.PUT_CUSTOM_EMAIL_TEMPLATE,
      customEmailTemplateSaga.putCustomEmailTemplate
    ),
    takeLatest(
      types.POST_CUSTOM_EMAIL_TEMPLATE,
      customEmailTemplateSaga.postCustomEmailTemplate
    )
  ])
}

export function* watchHelp() {
  yield all([
    takeLatest(types.GET_HELPS, helpSaga.getHelps),
    takeLatest(types.PUT_HELP, helpSaga.putHelp)
  ])
}

export function* watchCategories() {
  yield all([
    takeLatest(
      types.GET_CATEGORIES_BY_FEATURE,
      categoriesSaga.getCategoriesByFeature
    ),
    takeLatest(types.GET_CATEGORY_BY_ID, categoriesSaga.getCategoryById),
    takeLatest(types.PUT_CATEGORY, categoriesSaga.putCategory),
    takeLatest(types.DELETE_CATEGORY, categoriesSaga.deleteCategory),
    takeLatest(
      types.POST_CATEGORY_INTO_FEATURE,
      categoriesSaga.postCategoryIntoFeature
    )
  ])
}

export function* watchContents() {
  yield all([
    takeLatest(
      types.GET_CONTENTS_BY_FEATURE,
      contentsSaga.getContentsByFeature
    ),
    takeLatest(types.GET_CONTENT_BY_ID, contentsSaga.getContentById),
    takeLatest(types.PUT_CONTENT, contentsSaga.putContent),
    takeLatest(types.DELETE_CONTENT, contentsSaga.deleteContent),
    takeLatest(
      types.POST_CONTENT_INTO_FEATURE,
      contentsSaga.postContentIntoFeature
    ),
    takeLatest(
      types.DELETE_SELECTED_CONTENT,
      contentsSaga.deleteSelectedContent
    )
  ])
}

export function* watchRole() {
  yield all([
    takeLatest(types.GET_ROLES, roleSaga.getRoles),
    takeLatest(types.GET_ROLE_BY_ID, roleSaga.getRoleById),
    takeLatest(types.POST_ROLE, roleSaga.postRole),
    takeLatest(types.PUT_ROLE_BY_ID, roleSaga.putRoleById),
    takeLatest(types.GET_ROLE_PERMISSION_BY_ID, roleSaga.getRolePermissionById),
    takeLatest(types.PUT_ROLE_PERMISSION_BY_ID, roleSaga.putRolePermissionById)
  ])
}

export function* watchWorkplacePosters() {
  yield all([
    takeLatest(
      types.GET_WORKPLACE_POSTERS,
      workplacePosterSaga.getWorkplacePosters
    ),
    takeLatest(
      types.POST_WORKPLACE_POSTER,
      workplacePosterSaga.postWorkplacePoster
    ),
    takeLatest(
      types.DELETE_WORKPLACE_POSTER,
      workplacePosterSaga.deleteWorkplacePoster
    ),
    takeLatest(
      types.DELETE_SELECTED_WORKPLACE_POSTER,
      workplacePosterSaga.deleteSelectedWorkplacePoster
    ),
    takeLatest(
      types.GET_WORKPLACE_POSTER,
      workplacePosterSaga.getWorkplacePoster
    ),
    takeLatest(
      types.PUT_WORKPLACE_POSTER,
      workplacePosterSaga.putWorkplacePoster
    ),
    takeLatest(
      types.GET_WORKPLACE_POSTERS_TAGS,
      workplacePosterSaga.getWorkplacePosterTags
    ),
    takeLatest(
      types.POST_WORKPLACE_POSTER_TAG,
      workplacePosterSaga.postWorkplacePosterTag
    ),
    takeLatest(
      types.DELETE_WORKPLACE_POSTER_TAG,
      workplacePosterSaga.deleteWorkplacePosterTag
    )
  ])
}

export function* watchPreference() {
  yield all([
    takeLatest(
      types.GET_PREFERENCE_BY_ENTITY,
      preferenceSaga.getPreferenceByEntity
    ),
    takeLatest(
      types.PUT_PREFERENCE_BY_ENTITY,
      preferenceSaga.putPreferenceByEntity
    )
  ])
}

export function* watchWhiteLabel() {
  yield all([takeLatest(types.GET_WHITE_LABEL, whiteLabelSaga.getWhiteLabel)])
}

export function* watchAlert() {
  yield all([
    takeLatest(types.GET_ALERT_DEVICES_BY_ID, alertSaga.getAlertDevicesById),
    takeLatest(types.POST_ALERT_TRIGGER, alertSaga.postAlertTrigger),
    takeLatest(
      types.GET_DEVICE_MEDIA_EMERGENCY_ALERT,
      alertSaga.getDeviceMediaEmergencyAlert
    ),
    takeLatest(
      types.PUT_DEVICE_MEDIA_EMERGENCY_ALERT,
      alertSaga.putDeviceMediaEmergencyAlert
    ),
    takeLatest(
      types.GET_DEVICE_MEDIA_CAP_ALERT,
      alertSaga.getDeviceMediaCapAlert
    ),
    takeLatest(
      types.PUT_DEVICE_MEDIA_CAP_ALERT,
      alertSaga.putDeviceMediaCapAlert
    ),
    takeLatest(types.DISABLE_ALERT, alertSaga.disableAlert),
    takeLatest(types.DISABLE_DEVICE_ALERT, alertSaga.disableDeviceAlert),
    takeEvery(
      types.REQUEST_ASSOCIATE_CAP_ALERT,
      alertSaga.associateCapAlertWorker
    )
  ])
}

export function* watchSmartPlaylist() {
  yield all([
    takeLatest(
      types.BUILD_SMART_PLAYLIST,
      smartPlaylistSaga.buildSmartPlaylist
    ),
    takeLatest(types.POST_SMART_PLAYLIST, smartPlaylistSaga.postSmartPlaylist),
    takeLatest(types.PUT_SMART_PLAYLIST, smartPlaylistSaga.putSmartPlaylist)
  ])
}

export function* watchDesignGallery() {
  yield all([
    takeLatest(types.GET_DESIGN_GALLERY, designGallerySaga.getDesignGallery),
    takeLatest(types.POST_DESIGN_GALLERY, designGallerySaga.postDesignGallery),
    takeLatest(types.PUT_DESIGN_GALLERY, designGallerySaga.putDesignGallery),
    takeLatest(
      types.GET_BACKGROUND_IMAGES,
      designGallerySaga.getBackgroundImages
    ),
    takeLatest(types.GET_PATTERNS, designGallerySaga.getPatterns),
    takeLatest(types.SET_SELECTED_BG, designGallerySaga.setSelectedBg),
    takeLatest(types.GET_SHAPES, designGallerySaga.getShapes),
    takeLatest(types.GET_ICONS, designGallerySaga.getIcons),
    takeLatest(types.GET_EMOJIS, designGallerySaga.getEmojis),
    takeLatest(types.GET_STOCK_IMAGES, designGallerySaga.getStockImages),
    takeLatest(types.GET_DESIGNS, designGallerySaga.getDesigns)
  ])
}

export function* watchQuotes() {
  yield all([
    takeLatest(types.GET_QUOTES, quoteSaga.getQuotes),
    takeLatest(types.POST_QUOTE, quoteSaga.postQuote),
    takeLatest(types.GET_QUOTE_CATEGORIES, quoteSaga.getQuoteCategories)
  ])
}
