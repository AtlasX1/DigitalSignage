import {
  createMediaDummyData,
  createPlaylistDummyData,
  createPlaylistPreviewMediaDummyData,
  createTemplateDummyData,
  createReportDummyData,
  createUserDummyData,
  createDeviceDummyData,
  createDeviceGridDummyData,
  createDeviceScreenPreviewDummyData,
  createClientDummyData,
  createPackagesDummyData,
  createMessagesDummyData,
  createHelpPagesDummyData,
  createBannersDummyData,
  createChannelsDummyData,
  createOEMClientsDummyData,
  createRSSFeedsDummyData,
  createMediaUsageDummyData,
  createClientsByWidgetsDummyData,
  createFontDummyData,
  createTagsDummyData
} from './createDummyData'

import { formatBytes } from './formatBytes'
import stableSort from './stableSort'
import getSorting from './getSorting'
import desc from './desc'
import minTwoDigits from './minTwoDigits'
import isEven from './numbers'
import isSameDay from './isSameDay'
import getUserType from './getUserType'
import getToken from './getToken'
import getAccessUrl from './getAccessUrl'
import errorHandler from './errorHandler'
import clearStorage from './clearStorage'
import setToken from './setToken'
import sortByOrder from './sort'
import handleUnauthorized from './handleUnauthorized'
import weather from './weather'
import roles from './roles'
import getUrlPrefix from './permissionUrls'
import notificationAnalyzer from './notifyUtils'
import * as formDataHelper from './formDataHelper'
import queryParamsHelper from './queryParamsHelper'
import getAccessUrlWithoutEnterprise from './getAccessUrlWithoutEnterprise'
import selectUtils from './select'
import * as languageHelper from './language'
import shadeColor from './shadeColor'
import permissionsUtils from './permissionsUtils'
import capitalize from './capitalize'
import reducerUtils from './reducerUtils'
import isNotEmpty from './isNotEmpty'
import groupsUtils from './groupsUtils'
import libraryUtils from './libraryUtils'
import deviceAlertsUtils from './deviceAlertsUtils'
import convertImageToFile from './convertImageToFile'
import whiteLabelUtils from './whiteLabelUtils'
import windowUtils from './windowUtils'
import durationToTimeSpan from './durationToTimeSpan'
import * as distinctFilter from './distinctFilter'
import fileDownlaod from './fileDownload'
import * as docketsFileParser from './docketsFileParser'
import * as truncateStringUtils from './truncateStringUtils'

export {
  createMediaDummyData,
  createPlaylistDummyData,
  createPlaylistPreviewMediaDummyData,
  createTemplateDummyData,
  createReportDummyData,
  createUserDummyData,
  createDeviceDummyData,
  createDeviceGridDummyData,
  createDeviceScreenPreviewDummyData,
  createClientDummyData,
  createPackagesDummyData,
  createMessagesDummyData,
  createHelpPagesDummyData,
  createBannersDummyData,
  createChannelsDummyData,
  createOEMClientsDummyData,
  createRSSFeedsDummyData,
  createMediaUsageDummyData,
  createClientsByWidgetsDummyData,
  createFontDummyData,
  createTagsDummyData,
  formatBytes,
  minTwoDigits,
  isEven,
  isSameDay,
  convertImageToFile,
  // Table sort
  desc,
  stableSort,
  getSorting,
  getUserType,
  getToken,
  getAccessUrl,
  errorHandler,
  clearStorage,
  setToken,
  sortByOrder,
  handleUnauthorized,
  weather,
  roles,
  getUrlPrefix,
  notificationAnalyzer,
  formDataHelper,
  queryParamsHelper,
  getAccessUrlWithoutEnterprise,
  selectUtils,
  languageHelper,
  shadeColor,
  permissionsUtils,
  capitalize,
  reducerUtils,
  isNotEmpty,
  groupsUtils,
  deviceAlertsUtils,
  libraryUtils,
  whiteLabelUtils,
  windowUtils,
  durationToTimeSpan,
  distinctFilter,
  fileDownlaod,
  docketsFileParser,
  truncateStringUtils
}
