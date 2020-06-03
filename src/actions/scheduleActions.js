import * as types from './index'

const getScheduleItemsAction = params => ({
  type: types.GET_SCHEDULE_ITEMS,
  params
})

const getScheduleLibraryPrefAction = () => ({
  type: types.GET_SCHEDULE_PREFERENCE
})

const putScheduleLibraryPrefAction = data => ({
  type: types.PUT_SCHEDULE_PREFERENCE,
  payload: data
})

const getScheduleGroupsAction = () => ({
  type: types.GET_SCHEDULE_GROUPS
})

const clearGetScheduleGroupsInfoAction = () => ({
  type: types.CLEAR_GET_SCHEDULE_GROUPS_INFO
})

const getScheduleGroupItemsAction = id => ({
  type: types.GET_SCHEDULE_GROUP_ITEMS,
  payload: id
})

const clearGetScheduleGroupItemsInfoAction = () => ({
  type: types.CLEAR_GET_SCHEDULE_GROUP_ITEMS_INFO
})

const clearScheduleGroupItemsInfo = () => ({
  type: types.CLEAR_SCHEDULE_GROUP_ITEMS_RESPONSE_INFO
})

const postScheduleGroupItemAction = data => ({
  type: types.POST_SCHEDULE_GROUP_ITEM,
  payload: data
})

const clearPostScheduleGroupItemInfoAction = () => ({
  type: types.CLEAR_POST_SCHEDULE_GROUP_ITEM_INFO
})

const deleteScheduleGroupItemAction = data => ({
  type: types.DELETE_SCHEDULE_GROUP_ITEM,
  payload: data
})

const clearDeleteScheduleGroupItemInfoAction = () => ({
  type: types.CLEAR_DELETE_SCHEDULE_GROUP_ITEM_INFO
})

const deleteSelectedSchedules = ids => ({
  type: types.DELETE_SELECTED_SCHEDULES,
  ids
})

const deleteSchedule = id => ({
  type: types.DELETE_SCHEDULE,
  id
})

const clearResponseInfo = () => ({
  type: types.CLEAR_SCHEDULE_RESPONSE_INFO
})
const cloneSchedule = data => ({
  type: types.CLONE_SCHEDULE,
  data
})

export {
  getScheduleItemsAction,
  getScheduleLibraryPrefAction,
  putScheduleLibraryPrefAction,
  getScheduleGroupsAction,
  clearGetScheduleGroupsInfoAction,
  getScheduleGroupItemsAction,
  clearGetScheduleGroupItemsInfoAction,
  postScheduleGroupItemAction,
  clearPostScheduleGroupItemInfoAction,
  deleteScheduleGroupItemAction,
  clearDeleteScheduleGroupItemInfoAction,
  deleteSelectedSchedules,
  clearResponseInfo,
  cloneSchedule,
  deleteSchedule,
  clearScheduleGroupItemsInfo
}
