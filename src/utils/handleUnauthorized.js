import store from '../store/configureStore'
import history from '../history'

import {
  clearUserDetailsAction,
  clearUserSettingsAction
} from '../actions/userActions'
import {
  clearLogoutInfo,
  clearLoginInfo
} from '../actions/authenticationActions'

import clearStorage from './clearStorage'
import getUserType from './getUserType'

import { apiConstants } from '../constants'
import { clearSettingsAction } from '../actions/settingsActions'

const handleUnauthorized = () => {
  const type = getUserType()

  store.dispatch(clearUserDetailsAction())
  store.dispatch(clearUserSettingsAction())
  store.dispatch(clearSettingsAction())
  store.dispatch(clearLoginInfo())
  store.dispatch(clearLogoutInfo())

  clearStorage()

  const path =
    type === apiConstants.SYSTEM_USER
      ? '/system/sign-in'
      : type === apiConstants.ENTERPRISE_USER
      ? 'enterprise/sign-in'
      : '/sign-in'

  history.push(path)
}

export default handleUnauthorized
