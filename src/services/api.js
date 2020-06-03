import axios from 'axios'
import { get as _get } from 'lodash'

import * as config from '../config'

import {
  getToken,
  getAccessUrlWithoutEnterprise,
  handleUnauthorized
} from '../utils'
import getUserRoleLevel from '../utils/getUserRoleLevel'

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

BaseAxiosInstance.interceptors.request.use(req => {
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

export default params =>
  new Promise((resolve, reject) => {
    BaseAxiosInstance(params)
      .then(res => resolve(res))
      .catch(error => {
        if (_get(error, 'response.status') === 401) {
          handleUnauthorized()
        } else {
          reject(error)
        }
      })
  })
