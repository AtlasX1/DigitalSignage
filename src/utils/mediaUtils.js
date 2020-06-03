import { get as _get, isArray as _isArray } from 'lodash'
import moment from 'moment'
import { objectToFormData } from 'object-to-formdata'
import { selectUtils } from 'utils/index'

export const getAllowedFeatureId = (mediaCategories, category, group) => {
  const allowedOptions = _get(mediaCategories, 'response', [])
  const allowedWeb = allowedOptions.find(m => m.name === category)
  const allowedFeature = _get(allowedWeb, 'feature', [])
  const allowedItem = allowedFeature.find(f => f.name === group)
  return _get(allowedItem, 'id', false)
}

export const getFeatureNameById = (mediaCategorys, id) => {
  const allowedOptions = _get(mediaCategorys, 'response', [])
  const feature = allowedOptions.find(el => el.feature.find(f => f.id === id))
  return _get(feature, 'name', '').toLowerCase()
}

export const getVimeoIdByLink = url => {
  const vimeoUrl = 'vimeo.com'
  const index = url.indexOf(vimeoUrl) + vimeoUrl.length + 1
  return url.substring(index, url.length)
}

export const ObjectToFormData = obj =>
  objectToFormData(obj, { indices: true, nullsAsUndefineds: true })

export const createMediaPostData = (values, mode) => {
  const { title, activeDate, expireDate, priority, group, tags } = values
  const postData = {
    title,
    mediaPriority: +priority,
    attributes: {}
  }
  const postDataGroup = selectUtils.convertArr(group, selectUtils.fromChipObj)
  const postDataTag = selectUtils.convertArr(tags, selectUtils.fromChipObj)

  if (
    (mode === 'add' && postDataGroup.length) ||
    (mode === 'edit' && _isArray(postDataGroup))
  ) {
    postData.group = postDataGroup
  }
  if (
    (mode === 'add' && postDataTag.length) ||
    (mode === 'edit' && _isArray(postDataTag))
  ) {
    postData.tag = postDataTag
  }

  if (activeDate) postData.activateOn = activeDate.format('YYYY-MM-DD')
  if (expireDate) postData.expireOn = expireDate.format('YYYY-MM-DD')
  return postData
}

export const getMediaInfoFromBackendData = backendData => {
  const { title, mediaPriority, group, tag, activateOn, expireOn } = backendData
  return {
    title,
    group: selectUtils.convertArr(group, selectUtils.toChipObj),
    tags: selectUtils.convertArr(tag, selectUtils.toChipObj),
    priority: !!mediaPriority,
    activeDate: activateOn ? moment(activateOn, 'YYYY-MM-DD') : null,
    expireDate: expireOn ? moment(expireOn, 'YYYY-MM-DD') : null
  }
}

export const getMediaThemesSettings = (customProperties, isDefaultSetting) => {
  const parseSettings = (key, setting, allowedObject) => {
    if (
      typeof setting === 'string' &&
      setting.includes('[') &&
      setting.includes(']')
    ) {
      const params = setting
        .slice(setting.indexOf('[') + 1, setting.indexOf(']'))
        .split('-')
      allowedObject[`min_${key}`] = +params[0]
      allowedObject[`max_${key}`] = +params[1]
    } else if (typeof setting === 'string' && setting.includes('|')) {
      allowedObject[key] = setting.split('|')
    } else if (key === 'click_effect') {
      allowedObject[key] = Object.keys(setting)
    } else {
      allowedObject[key] = setting
    }
  }

  const settings = isDefaultSetting
    ? _get(customProperties, 'other.default_values')
    : _get(customProperties, 'theme_settings')

  const allowedSettings = {}

  if (!settings) return

  Object.keys(settings).forEach(key => {
    const prop = settings[key]
    if (
      typeof prop === 'object' &&
      Object.keys(prop).length &&
      !Array.isArray(prop)
    ) {
      const propAllowedSettings = {}
      Object.keys(prop).forEach(propKey => {
        parseSettings(propKey, prop[propKey], propAllowedSettings)
      })
      allowedSettings[key] = propAllowedSettings
    } else {
      parseSettings(key, prop, allowedSettings)
    }
  })

  return allowedSettings
}

export const csvJSON = csv => {
  const rowLines = csv.split('\n')
  rowLines.splice(rowLines.length - 1, 1)
  const lines = rowLines
  const result = []
  const headers = lines[0].split(',')

  for (let i = 1; i < lines.length; i++) {
    const obj = {}
    const currentLine = lines[i].split(',')

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentLine[j]
    }

    result.push(obj)
  }

  return result
}
