import axios from 'axios'
import { get as _get } from 'lodash'

import * as config from '../config'

import {
  getToken,
  getAccessUrlWithoutEnterprise,
  handleUnauthorized
} from '../utils'
import getUserRoleLevel from '../utils/getUserRoleLevel'

import store from '../store/configureStore'
import { setPendingStatus } from '../actions/appActions'
import { isEqual, isFalsy, isTruthy } from 'utils/generalUtils'

const urlsWithoutPrefix = ['system/login', 'org/login']

const urlsWithoutEnterprisePrefix = [
  '/info',
  '/login',
  '/logout',
  '/sociallogin',
  '/recovery',
  '/reset',
  '/refresh',
  '/me',
  '/preference',
  '/preference/ClientLibrary',
  '/preference/MediaLibrary',
  '/preference/PlaylistLibrary',
  '/preference/TemplateLibrary',
  '/preference/ScheduleLibrary',
  '/preference/UserLibrary',
  '/preference/DeviceLibrary'
]

const BaseAxiosInstance = axios.create({
  baseURL: config.API_URL,
  responseType: 'json'
})

let requestPending = 0

BaseAxiosInstance.interceptors.request.use(req => {
  requestPending++
  if (requestPending === 1) {
    store.dispatch(setPendingStatus(true))
  }
  const headers = { ...req.headers }

  if (!headers.Authorization && getToken()) {
    headers.Authorization = getToken()
  }

  let baseURL = req.baseURL

  if (!urlsWithoutPrefix.includes(req.url)) {
    const prefix = urlsWithoutEnterprisePrefix.includes(req.url)
      ? getAccessUrlWithoutEnterprise()
      : getUserRoleLevel()

    baseURL = `${baseURL}/${prefix}`
  }

  return {
    ...req,
    headers,
    baseURL
  }
})

BaseAxiosInstance.interceptors.response.use(
  config => {
    requestPending--
    if (requestPending === 0) store.dispatch(setPendingStatus(false))

    return config
  },
  err => {
    requestPending--
    if (requestPending === 0) store.dispatch(setPendingStatus(false))
    return Promise.reject(err)
  }
)

export default params =>
  new Promise((resolve, reject) => {
    BaseAxiosInstance(params)
      .then(res => resolve(res))
      .catch(error => {
        if (
          isTruthy(
            isEqual(_get(error, 'response.status'), 401),
            isFalsy(
              isEqual(
                _get(error, 'response.data.message'),
                'Credentials Invalid'
              )
            )
          )
        ) {
          handleUnauthorized()
        } else {
          reject(error)
        }
      })
  })
