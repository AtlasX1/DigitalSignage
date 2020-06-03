import { call, put } from 'redux-saga/effects'

import * as types from '../actions'

import { clientsService } from '../services'
import { transformMeta } from 'utils/tableUtils'

function* getClients({ params }) {
  try {
    const { meta, data: response } = yield call(
      clientsService.getClients,
      params
    )

    const modifiedMeta = transformMeta(meta)

    yield put({
      type: types.GET_CLIENTS_SUCCESS,
      response,
      modifiedMeta
    })
  } catch (error) {
    yield put({ type: types.GET_CLIENTS_ERROR, payload: error })
  }
}

function* getClientById({ id }) {
  try {
    const response = yield call(clientsService.getClientById, id)
    yield put({ type: types.GET_CLIENT_BY_ID_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_CLIENT_BY_ID_ERROR, payload: error })
  }
}

function* postClient({ data }) {
  try {
    yield call(clientsService.postClient, data)
    yield put({
      type: types.POST_CLIENT_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.POST_CLIENT_ERROR, payload: error })
  }
}

function* putClient({ id, data }) {
  try {
    yield call(clientsService.putClient, id, data)
    yield put({
      type: types.PUT_CLIENT_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.PUT_CLIENT_ERROR, payload: error })
  }
}

function* getGroupItems(action) {
  try {
    const response = yield call(clientsService.getGroupItems, action.payload)
    yield put({ type: types.GET_CLIENT_GROUP_ITEMS_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_CLIENT_GROUP_ITEMS_ERROR, payload: error })
  }
}

function* postGroupItem(action) {
  try {
    yield call(clientsService.postGroupItem, action.payload)
    yield put({
      type: types.POST_CLIENT_GROUP_ITEM_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.POST_CLIENT_GROUP_ITEM_ERROR, payload: error })
  }
}

function* deleteGroupItem(action) {
  try {
    yield call(clientsService.deleteGroupItem, action.payload)
    yield put({
      type: types.DELETE_CLIENT_GROUP_ITEM_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.DELETE_CLIENT_GROUP_ITEM_ERROR, payload: error })
  }
}

function* getClientNotes({ payload }) {
  try {
    const response = yield call(clientsService.getClientNotes, payload)
    yield put({ type: types.GET_CLIENT_NOTES_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_CLIENT_NOTES_ERROR, payload: error })
  }
}

function* postClientNote({ payload: { id, data } }) {
  try {
    const response = yield call(clientsService.postClientNote, id, data)
    yield put({ type: types.POST_CLIENT_NOTE_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.POST_CLIENT_NOTE_ERROR, payload: error })
  }
}

export default {
  getClients,
  getClientById,
  postClient,
  putClient,
  getGroupItems,
  postGroupItem,
  deleteGroupItem,
  getClientNotes,
  postClientNote
}
