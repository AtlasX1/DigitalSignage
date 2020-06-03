import { fork } from 'redux-saga/effects'
import {
  watchUserAuthentication,
  watchUser,
  watchUserLogout,
  watchUpdateToken,
  watchOktaAuthentication,
  watchRecovery,
  watchReset,
  watchImpersonateUser,
  watchMedia,
  watchPlaylist,
  watchTemplate,
  watchSchedule,
  watchDevice,
  watchReport,
  watchClient,
  watchUsers,
  watchDashboard,
  watchFeedback,
  watchTags,
  watchGroups,
  watchSignageEditor,
  watchFonts,
  watchConfig,
  watchClientPackage,
  watchHTMLContent,
  watchBanners,
  watchClientSettings,
  watchDevicePackage,
  watchBandwidthPackage,
  watchEmailTemplate,
  watchHelp,
  watchSettings,
  watchCategories,
  watchContents,
  watchAlert,
  watchRole,
  watchAnnouncements,
  watchWorkplacePosters,
  watchCustomEmailTemplate,
  watchPreference,
  watchClientUsers,
  watchWhiteLabel,
  watchQuotes,
  watchDesignGallery
} from './watchers'

export default function* rootSaga() {
  yield fork(watchUserAuthentication)
  yield fork(watchOktaAuthentication)
  yield fork(watchUser)
  yield fork(watchUserLogout)
  yield fork(watchUpdateToken)
  yield fork(watchRecovery)
  yield fork(watchReset)
  yield fork(watchImpersonateUser)
  yield fork(watchMedia)
  yield fork(watchPlaylist)
  yield fork(watchTemplate)
  yield fork(watchSchedule)
  yield fork(watchDevice)
  yield fork(watchReport)
  yield fork(watchClient)
  yield fork(watchUsers)
  yield fork(watchFeedback)
  yield fork(watchDashboard)
  yield fork(watchTags)
  yield fork(watchGroups)
  yield fork(watchSignageEditor)
  yield fork(watchConfig)
  yield fork(watchFonts)
  yield fork(watchClientSettings)
  yield fork(watchSettings)
  yield fork(watchHTMLContent)
  yield fork(watchBanners)
  yield fork(watchClientPackage)
  yield fork(watchDevicePackage)
  yield fork(watchBandwidthPackage)
  yield fork(watchEmailTemplate)
  yield fork(watchHelp)
  yield fork(watchCategories)
  yield fork(watchContents)
  yield fork(watchRole)
  yield fork(watchAnnouncements)
  yield fork(watchWorkplacePosters)
  yield fork(watchCustomEmailTemplate)
  yield fork(watchPreference)
  yield fork(watchClientUsers)
  yield fork(watchWhiteLabel)
  yield fork(watchQuotes)
  yield fork(watchAlert)
  yield fork(watchDesignGallery)
}
