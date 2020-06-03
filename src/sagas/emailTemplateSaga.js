import { call, put } from 'redux-saga/effects'

import * as types from '../actions'

import { emailTemplateService } from '../services'
import { transformMeta } from 'utils/tableUtils'

function* getEmailTemplates({ params }) {
  try {
    const { meta, data } = yield call(
      emailTemplateService.getEmailTemplates,
      params
    )

    //Set the end of the download
    const modifiedMeta = transformMeta(meta)

    yield put({
      type: types.GET_EMAIL_TEMPLATES_SUCCESS,
      response: data,
      modifiedMeta
    })
  } catch (error) {
    yield put({ type: types.GET_EMAIL_TEMPLATES_ERROR, payload: error })
  }
}

function* getEmailTemplateById({ id }) {
  try {
    const response = yield call(emailTemplateService.getEmailTemplateById, id)
    yield put({
      type: types.GET_EMAIL_TEMPLATE_BY_ID_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GET_EMAIL_TEMPLATE_BY_ID_ERROR, payload: error })
  }
}

function* putEmailTemplate({ id, data }) {
  try {
    yield call(emailTemplateService.putEmailTemplate, id, data)
    yield put({
      type: types.PUT_EMAIL_TEMPLATE_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.PUT_EMAIL_TEMPLATE_ERROR, payload: error })
  }
}

export default {
  getEmailTemplates,
  getEmailTemplateById,
  putEmailTemplate
}
