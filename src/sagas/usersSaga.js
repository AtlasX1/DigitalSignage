import { all, call, put } from 'redux-saga/effects'
import * as types from 'actions'
import { usersService } from 'services'
import { transformMeta } from 'utils/tableUtils'

function* getItems({ params }) {
  try {
    const { data, meta } = yield call(usersService.getItems, params)

    const modifiedMeta = transformMeta(meta)

    yield put({
      type: types.GET_USERS_ITEMS_SUCCESS,
      response: data,
      modifiedMeta
    })
  } catch (error) {
    yield put({ type: types.GET_USERS_ITEMS_ERROR, payload: error })
  }
}

function* postItem(action) {
  try {
    yield call(usersService.postItem, action.payload)
    yield put({
      type: types.POST_USERS_ITEM_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.POST_USERS_ITEM_ERROR, payload: error })
  }
}

function* deleteItem(action) {
  try {
    yield call(usersService.deleteItem, action.payload)
    yield put({
      type: types.DELETE_USERS_ITEM_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.DELETE_USERS_ITEM_ERROR, payload: error })
  }
}

function* deleteSelectedItems({ ids }) {
  try {
    yield all(ids.map(id => call(usersService.deleteItem, id)))
    yield put({
      type: types.DELETE_SELECTED_USERS_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.DELETE_SELECTED_USERS_ERROR, payload: error })
  }
}

function* getItem(action) {
  try {
    const response = yield call(usersService.getItem, action.payload)
    yield put({ type: types.GET_USERS_ITEM_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_USERS_ITEM_ERROR, payload: error })
  }
}

function* putItem({ data, id }) {
  try {
    yield call(usersService.putItem, id, data)
    yield put({
      type: types.PUT_USERS_ITEM_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.PUT_USERS_ITEM_ERROR, payload: error })
  }
}

function* getGroups({ params }) {
  try {
    const { data, meta } = yield call(usersService.getGroups, params)
    const modifiedMeta = transformMeta(meta)

    yield put({ type: types.GET_USERS_GROUPS_SUCCESS, data, modifiedMeta })
  } catch (error) {
    yield put({ type: types.GET_USERS_GROUPS_ERROR, payload: error })
  }
}

function* getUngroupedUsers() {
  try {
    const { data, meta } = yield call(usersService.getUngroupedUsers)
    const modifiedMeta = transformMeta(meta)

    yield put({ type: types.GET_UNGROUPED_USERS_SUCCESS, data, modifiedMeta })
  } catch (error) {
    yield put({ type: types.GET_UNGROUPED_USERS_ERROR, payload: error })
  }
}

function* getUsersGroupItems(action) {
  try {
    const response = yield call(
      usersService.getGroupItems,
      action.payload.id,
      action.payload.params
    )
    const modifiedMeta = transformMeta(response.meta)
    yield put({
      type: types.GET_USERS_GROUP_ITEMS_SUCCESS,
      payload: response,
      modifiedMeta
    })
  } catch (error) {
    yield put({ type: types.GET_USERS_GROUP_ITEMS_ERROR, payload: error })
  }
}

function* postUsersGroupItem(action) {
  try {
    yield call(usersService.postGroupItem, action.payload)
    yield put({
      type: types.POST_USERS_GROUP_ITEM_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.POST_USERS_GROUP_ITEM_ERROR, payload: error })
  }
}

function* deleteUsersGroupItem(action) {
  try {
    yield call(usersService.deleteGroupItem, action.payload)
    yield put({
      type: types.DELETE_USERS_GROUP_ITEM_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.DELETE_USERS_GROUP_ITEM_ERROR, payload: error })
  }
}

function* getUsersPermission(action) {
  try {
    const response = yield call(usersService.getUsersPermission, action.payload)
    yield put({ type: types.GET_USERS_PERMISSION_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: types.GET_USERS_PERMISSION_ERROR, payload: error })
  }
}

function* putUsersPermission(action) {
  try {
    yield call(usersService.putUsersPermission, action.payload)
    yield put({
      type: types.PUT_USERS_PERMISSION_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.PUT_USERS_PERMISSION_ERROR, payload: error })
  }
}

function* getUsersGroupPermission(action) {
  try {
    const response = yield call(
      usersService.getUsersGroupPermission,
      action.payload
    )
    yield put({
      type: types.GET_USERS_GROUP_PERMISSION_SUCCESS,
      payload: response
    })
  } catch (error) {
    yield put({ type: types.GET_USERS_GROUP_PERMISSION_ERROR, payload: error })
  }
}

function* putUsersGroupPermission(action) {
  try {
    yield call(usersService.putUsersGroupPermission, action.payload)
    yield put({
      type: types.PUT_USERS_GROUP_PERMISSION_SUCCESS,
      payload: { status: 'success' }
    })
  } catch (error) {
    yield put({ type: types.PUT_USERS_GROUP_PERMISSION_ERROR, payload: error })
  }
}

export default {
  getItems,
  postItem,
  getItem,
  putItem,
  getGroups,
  deleteItem,

  getUngroupedUsers,
  getUsersGroupItems,
  postUsersGroupItem,

  getUsersPermission,
  putUsersPermission,
  deleteUsersGroupItem,
  getUsersGroupPermission,
  putUsersGroupPermission,
  deleteSelectedItems
}
