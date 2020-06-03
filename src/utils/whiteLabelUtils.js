import * as R from 'ramda'

import { whiteLabelConstants } from 'constants/index'

const DATA_NAME = 'xhibit-white-label-info'
const localStorage = window.localStorage

const stringify = data => {
  try {
    return JSON.stringify(data)
  } catch (error) {
    return ''
  }
}
const parse = data => {
  try {
    return JSON.parse(data)
  } catch (error) {
    return {}
  }
}

const getInfoFromLocalStorage = () => {
  return parse(localStorage.getItem(DATA_NAME))
}
const isInfoInLocalStorage = () => {
  return Boolean(getInfoFromLocalStorage())
}
const setInfoToLocalStorage = data => {
  return localStorage.setItem(DATA_NAME, stringify(data))
}
const isSendRequest = (requestActionFn, reducerActionFn) => {
  return R.ifElse(
    R.partial(R.not, [isInfoInLocalStorage()]),
    R.partial(requestActionFn, []),
    R.partial(reducerActionFn, [getInfoFromLocalStorage()])
  )()
}
const sendRequestOrGetFromLocalStorage = (requestActionFn, reducerActionFn) => {
  return R.partial(isSendRequest, [requestActionFn, reducerActionFn])
}
const parseReducer = reducer => {
  const returnFallbackObj = () => whiteLabelConstants.fallbackValues
  const returnResponse = response => {
    return { ...response }
  }
  const isIsEmptyInResponse = response => {
    return R.ifElse(
      R.has('isEmpty'),
      returnFallbackObj,
      returnResponse
    )(response)
  }
  const isEmptyResponse = reducer => {
    return R.ifElse(
      R.isEmpty,
      returnFallbackObj,
      isIsEmptyInResponse
    )(reducer.response)
  }
  return R.ifElse(
    R.has('response'),
    isEmptyResponse,
    returnFallbackObj
  )(reducer)
}

export default {
  sendRequestOrGetFromLocalStorage,
  setInfoToLocalStorage,
  parseReducer
}
