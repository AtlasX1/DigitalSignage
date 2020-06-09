import {
  CUSTOM_EMAIL_TEMPLATE,
  HTML_CONTENT,
  EMAIL_TEMPLATE
} from 'constants/library'

import { combineReducers } from 'redux'
import login from './loginReducer'
import user from './userReducer'
import logout from './logoutReducer'
import createTemplate from './createTemplateReducer'
import resetPassword from './resetPasswordReducer'
import media from './mediaReducer'
import addMedia from './addMediaReducer'
import addPlaylist from './addPlaylistReducer'
import playlist from './playlistReducer'
import template from './templateReducer'
import schedule from './scheduleReducer'
import device from './deviceReducer'
import report from './reportReducer'
import clients from './clientReducer'
import users from './usersReducer'
import dashboard from './dashboardReducer'
import feedback from './feedbackReducer'
import tags from './tagsReducer'
import group from './groupReducer'
import designGallery from './designGallery/designGalleryReducer'
import leftSidebar from './designGallery/leftSidebarReducer'
import config from './configReducer'
import fonts from './fontsReducer'
import clientPackage from './clientPackageReducer'
import devicePackage from './devicePackageReducer'
import bandwidthPackage from './bandwidthPackageReducer'
import clientSettings from './clientSettingsReducer'
import settings from './settingsReducer'
import HTMLContent from './HTMLContentReducer'
import banners from './bannersReducer'
import emailTemplate from './emailTemplateReducer'
import helps from './helpReducer'
import alert from './alertReducer'
import categories from './categoriesReducer'
import contents from './contentsReducer'
import customEmailTemplate from './customEmailTemplateReducer'
import role from './roleReducer'
import workplacePosters from './workplacePosterReducer'
import preference from './preferenceReducer'
import impersonateReducer from 'reducers/impersonateReducer'
import clientUsers from './clientUsersReducer'
import whiteLabel from './whiteLabelReducer'
import smartPlaylist from './smartPlaylistReducer'
import quoteReducer from './quoteReducer'
import appReducer from './appReducer'

const editorReducer = combineReducers({
  designGallery,
  leftSidebar
})

const rootReducer = combineReducers({
  appReducer,
  user,
  users,
  tags,
  login,
  media,
  addMedia,
  addPlaylist,
  group,
  logout,
  device,
  clients,
  schedule,
  report,
  feedback,
  playlist,
  template,
  dashboard,
  resetPassword,
  impersonateReducer,
  createTemplate,
  editor: editorReducer,
  config,
  fonts,
  [HTML_CONTENT]: HTMLContent,
  clientSettings,
  settings,
  banners,
  clientPackage,
  devicePackage,
  bandwidthPackage,
  [EMAIL_TEMPLATE]: emailTemplate,
  helps,
  categories,
  contents,
  role,
  workplacePosters,
  [CUSTOM_EMAIL_TEMPLATE]: customEmailTemplate,
  preference,
  whiteLabel,
  quoteReducer,
  clientUsers,
  smartPlaylist,
  alert
})

export default rootReducer
