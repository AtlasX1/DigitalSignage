import { call, put } from '@redux-saga/core/effects'
import { helpService } from '../services'
import * as types from '../actions'
import { transformMeta } from 'utils/tableUtils'

function* getHelps({ params }) {
  try {
    const { meta, data } = yield call(helpService.getHelps, params)

    //Set the end of the download
    const modifiedMeta = transformMeta(meta)

    yield put({
      type: types.GET_HELPS_SUCCESS,
      response: data,
      modifiedMeta
    })
  } catch (error) {
    yield put({ type: types.GET_HELPS_ERROR, payload: error })
  }
}

function* putHelp({ id, data }) {
  try {
    yield call(helpService.putHelp, id, data)
    yield put({ type: types.PUT_HELP_SUCCESS, payload: { status: 'success' } })
  } catch (error) {
    yield put({ type: types.PUT_HELP_ERROR, payload: error })
  }
}

export default {
  getHelps,
  putHelp
}
