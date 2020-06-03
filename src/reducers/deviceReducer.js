import update from 'immutability-helper'

import * as types from '../actions'

const initialState = {
  library: {},
  meta: {
    currentPage: 1,
    from: 0,
    lastPage: 1,
    perPage: 10,
    to: 10,
    total: 0,
    count: 0
  },
  preference: {},
  groups: {},
  put: {},
  item: {},
  preview: {},
  groupItems: {},
  postGroupItem: {},
  deleteGroupItem: {},
  reboot: {},
  putReboot: {},
  sleepMode: {},
  putSleepMode: {},
  note: {},
  postNote: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_DEVICE_ITEMS_SUCCESS:
      return update(state, {
        library: {
          response: { $set: action.payload.data }
        },
        meta: { $set: action.payload.meta }
      })
    case types.GET_DEVICE_ITEMS_ERROR:
      return update(state, {
        library: {
          error: { $set: action.payload }
        }
      })
    case types.GET_DEVICE_PREFERENCE_SUCCESS:
      return update(state, {
        preference: {
          response: { $set: action.payload }
        }
      })
    case types.GET_DEVICE_PREFERENCE_ERROR:
      return update(state, {
        preference: {
          error: { $set: action.payload }
        }
      })
    case types.PUT_DEVICE_PREFERENCE_ERROR:
      return update(state, {
        performance: {
          error: { $set: action.payload }
        }
      })
    case types.GET_DEVICE_GROUPS_SUCCESS:
      return update(state, {
        groups: {
          response: { $set: action.payload }
        }
      })
    case types.GET_DEVICE_GROUPS_ERROR:
      return update(state, {
        groups: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_DEVICE_GROUPS_INFO:
      return update(state, {
        groups: { $set: {} }
      })
    case types.PUT_DEVICE_ITEM_SUCCESS:
      return update(state, {
        put: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_DEVICE_ITEM_ERROR:
      return update(state, {
        put: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_PUT_DEVICE_ITEM_INFO:
      return update(state, {
        put: { $set: {} }
      })
    case types.GET_DEVICE_ITEM_SUCCESS:
      return update(state, {
        item: {
          response: { $set: action.payload }
        }
      })
    case types.GET_DEVICE_ITEM_ERROR:
      return update(state, {
        item: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_DEVICE_ITEM_INFO:
      return update(state, {
        item: { $set: {} }
      })
    case types.GET_DEVICE_PREVIEW_SUCCESS:
      return update(state, {
        preview: {
          response: { $set: action.payload }
        }
      })
    case types.GET_DEVICE_PREVIEW_ERROR:
      return update(state, {
        preview: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_DEVICE_PREVIEW_INFO:
      return update(state, {
        preview: { $set: {} }
      })
    case types.GET_DEVICE_GROUP_ITEMS_SUCCESS:
      return update(state, {
        groupItems: {
          response: { $set: action.payload }
        }
      })
    case types.GET_DEVICE_GROUP_ITEMS_ERROR:
      return update(state, {
        groupItems: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_DEVICE_GROUP_ITEMS_INFO:
      return update(state, {
        groupItems: { $set: {} }
      })
    case types.POST_DEVICE_GROUP_ITEM_SUCCESS:
      return update(state, {
        postGroupItem: {
          response: { $set: action.payload }
        }
      })
    case types.POST_DEVICE_GROUP_ITEM_ERROR:
      return update(state, {
        postGroupItem: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_POST_DEVICE_GROUP_ITEM_INFO:
      return update(state, {
        postGroupItem: { $set: {} }
      })
    case types.DELETE_DEVICE_GROUP_ITEM_SUCCESS:
      return update(state, {
        deleteGroupItem: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_DEVICE_GROUP_ITEM_ERROR:
      return update(state, {
        deleteGroupItem: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_DELETE_DEVICE_GROUP_ITEM_INFO:
      return update(state, {
        deleteGroupItem: { $set: {} }
      })
    case types.CLEAR_DEVICE_GROUP_ITEMS_RESPONSE_INFO:
      return update(state, {
        $merge: {
          groupItems: {},
          postGroupItem: {},
          deleteGroupItem: {}
        }
      })
    case types.GET_DEVICE_REBOOT_SUCCESS:
      return update(state, {
        reboot: {
          response: { $set: action.payload }
        }
      })
    case types.GET_DEVICE_REBOOT_ERROR:
      return update(state, {
        reboot: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_DEVICE_REBOOT_INFO:
      return update(state, {
        reboot: { $set: {} }
      })
    case types.PUT_DEVICE_REBOOT_SUCCESS:
      return update(state, {
        putReboot: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_DEVICE_REBOOT_ERROR:
      return update(state, {
        putReboot: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_PUT_DEVICE_REBOOT_INFO:
      return update(state, {
        putReboot: { $set: {} }
      })
    case types.GET_DEVICE_SLEEP_MODE_SUCCESS:
      return update(state, {
        sleepMode: {
          response: { $set: action.payload }
        }
      })
    case types.GET_DEVICE_SLEEP_MODE_ERROR:
      return update(state, {
        sleepMode: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_DEVICE_SLEEP_MODE_INFO:
      return update(state, {
        sleepMode: { $set: {} }
      })
    case types.PUT_DEVICE_SLEEP_MODE_SUCCESS:
      return update(state, {
        putSleepMode: {
          response: { $set: action.payload }
        }
      })
    case types.PUT_DEVICE_SLEEP_MODE_ERROR:
      return update(state, {
        putSleepMode: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_PUT_DEVICE_SLEEP_MODE_INFO:
      return update(state, {
        putSleepMode: { $set: {} }
      })
    case types.GET_DEVICE_NOTES_SUCCESS:
      return update(state, {
        note: {
          response: { $set: action.payload }
        }
      })
    case types.GET_DEVICE_NOTES_ERROR:
      return update(state, {
        note: {
          error: { $set: action.payload }
        }
      })
    case types.POST_DEVICE_NOTE_SUCCESS:
      return update(state, {
        postNote: {
          response: { $set: action.payload }
        }
      })
    case types.POST_DEVICE_NOTE_ERROR:
      return update(state, {
        postNote: {
          error: { $set: action.payload }
        }
      })
    default:
      return state
  }
}
