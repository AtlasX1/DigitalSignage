import { call, put } from 'redux-saga/effects'

import * as types from '../actions'

import { customEmailTemplateService } from '../services'
import { transformMeta } from 'utils/tableUtils'

function* getCustomEmailTemplates({ params }) {
  try {
    const { meta, data } = yield call(
      customEmailTemplateService.getCustomEmailTemplates,
      params
    )

    //Set the end of the download
    const modifiedMeta = transformMeta(meta)

    yield put({
      type: types.GET_CUSTOM_EMAIL_TEMPLATES_SUCCESS,
      response: data,
      modifiedMeta
    })
  } catch (error) {
    yield put({ type: types.GET_CUSTOM_EMAIL_TEMPLATES_ERROR, payload: error })
  }
}

function* getCustomEmailTemplateById({ id }) {
  try {
    const response = yield call(
      customEmailTemplateService.getCustomEmailTemplateById,
      id
    )
    yield put({
      type: types.GET_CUSTOM_EMAIL_TEMPLATE_BY_ID_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({
      type: types.GET_CUSTOM_EMAIL_TEMPLATE_BY_ID_ERROR,
      payload: error
    })
  }
}

function* putCustomEmailTemplate({ id, data }) {
  try {
    yield call(customEmailTemplateService.putCustomEmailTemplate, id, data)
    yield put({
      type: types.PUT_CUSTOM_EMAIL_TEMPLATE_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.PUT_CUSTOM_EMAIL_TEMPLATE_ERROR, payload: error })
  }
}

function* postCustomEmailTemplate({ id, data }) {
  try {
    yield call(customEmailTemplateService.postCustomEmailTemplate, id, data)
    yield put({
      type: types.PUT_CUSTOM_EMAIL_TEMPLATE_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.PUT_CUSTOM_EMAIL_TEMPLATE_ERROR, payload: error })
  }
}

export default {
  getCustomEmailTemplates,
  getCustomEmailTemplateById,
  putCustomEmailTemplate,
  postCustomEmailTemplate
}
