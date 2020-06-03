import { call, put } from 'redux-saga/effects'
import { preferenceService } from 'services'
import * as types from 'actions'
import { isEmpty } from 'lodash'

function* getPreferenceByEntity({ entity }) {
  try {
    const [response = {}] = yield call(
      preferenceService.getPreferenceByEntity,
      entity
    )

    let status = 'received'

    if (isEmpty(response)) {
      status = 'empty'
    }

    yield put({
      type: types.GET_PREFERENCE_BY_ENTITY_SUCCESS,
      response,
      status,
      entity
    })
  } catch (error) {
    yield put({
      type: types.GET_PREFERENCE_BY_ENTITY_ERROR,
      payload: {
        entity,
        error
      }
    })
  }
}

function* putPreferenceByEntity({ entity, data }) {
  try {
    yield call(preferenceService.putPreferenceByEntity, entity, data)
    yield put({
      type: types.PUT_PREFERENCE_BY_ENTITY_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.PUT_PREFERENCE_BY_ENTITY_ERROR, payload: error })
  }
}

export default {
  getPreferenceByEntity,
  putPreferenceByEntity
}
