import { all, call, put } from 'redux-saga/effects'
import * as types from 'actions'
import { clientUsersService } from 'services'
import { transformMeta } from 'utils/tableUtils'

function* getItems({ params }) {
  try {
    const { data, meta } = yield call(clientUsersService.getItems, params)

    const modifiedMeta = transformMeta(meta)

    yield put({
      type: types.GET_CLIENT_USERS_ITEMS_SUCCESS,
      response: data,
      modifiedMeta
    })
  } catch (error) {
    yield put({ type: types.GET_CLIENT_USERS_ITEMS_ERROR, payload: error })
  }
}

function* postItem(action) {
  try {
    yield call(clientUsersService.postItem, action.payload)
    yield put({
      type: types.POST_CLIENT_USERS_ITEM_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.POST_CLIENT_USERS_ITEM_ERROR, payload: error })
  }
}

function* deleteItem(action) {
  try {
    yield call(clientUsersService.deleteItem, action.payload)
    yield put({
      type: types.DELETE_CLIENT_USERS_ITEM_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.DELETE_CLIENT_USERS_ITEM_ERROR, payload: error })
  }
}

function* deleteSelectedItems({ ids }) {
  try {
    yield all(ids.map(id => call(clientUsersService.deleteItem, id)))
    yield put({
      type: types.DELETE_SELECTED_CLIENT_USERS_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({
      type: types.DELETE_SELECTED_CLIENT_USERS_ERROR,
      payload: error
    })
  }
}

function* getItem(action) {
  try {
    const response = yield call(clientUsersService.getItem, action.payload)
    yield put({ type: types.GET_CLIENT_USERS_ITEM_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_CLIENT_USERS_ITEM_ERROR, payload: error })
  }
}

function* putItem({ data, id }) {
  try {
    yield call(clientUsersService.putItem, id, data)
    yield put({
      type: types.PUT_CLIENT_USERS_ITEM_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.PUT_CLIENT_USERS_ITEM_ERROR, payload: error })
  }
}

export default {
  getItems,
  postItem,
  getItem,
  putItem,
  deleteItem,
  deleteSelectedItems
}
