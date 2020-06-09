import * as types from './index'

const getMediaItemsAction = params => ({
  type: types.GET_MEDIA_ITEMS,
  params
})

const clearGetMediaItemsInfoAction = () => ({
  type: types.CLEAR_GET_MEDIA_ITEMS_INFO
})

const clearMediaItemsAction = params => ({
  type: types.CLEAR_MEDIA_ITEMS,
  params
})

const getMediaLibraryPref = () => ({ type: types.GET_MEDIA_PREFERENCE })

const putMediaLibraryPref = data => ({
  type: types.PUT_MEDIA_PREFERENCE,
  payload: data
})

const getMediaGroupsAction = (data = {}) => ({
  type: types.GET_MEDIA_GROUPS,
  payload: data
})

const addMedia = ({ mediaName, tabName, data }) => ({
  type: types.ADD_MEDIA,
  data,
  meta: {
    mediaName,
    tabName
  }
})

const editMedia = ({ id, mediaName, tabName, data, method }) => ({
  type: types.PUT_MEDIA,
  data,
  meta: {
    id,
    mediaName,
    tabName,
    method
  }
})

const clearAddedMedia = meta => ({
  type: types.CLEAR_ADDED_MEDIA,
  meta
})

const clearEditMedia = () => ({
  type: types.CREAR_MEDIA_ITEM
})

const clearMediaPut = () => ({
  type: types.CLEAR_MEDIA_PUT
})

const clearMediaItemStatus = () => ({
  type: types.CLEAR_MEDIA_ITEM_STATUS
})

const getMediaPreview = data => ({
  type: types.GET_MEDIA_PREVIEW,
  data
})

const generateMediaPreview = data => ({
  type: types.GENERATE_MEDIA_PREVIEW,
  data
})

const closeMediaPreview = () => ({
  type: types.CLOSE_MEDIA_PREVIEW
})

const clearMediaPreview = () => ({
  type: types.CLEAR_MEDIA_PREVIEW
})

const showMediaPreview = () => ({
  type: types.SHOW_MEDIA_PREVIEW
})

const clearGetMediaGroupsInfoAction = () => ({
  type: types.CLEAR_GET_MEDIA_GROUPS_INFO
})

const clearMediaGroupItemsInfo = () => ({
  type: types.CLEAR_MEDIA_GROUP_ITEMS_RESPONSE_INFO
})

const getMediaGroupItemsAction = (id, params) => ({
  type: types.GET_MEDIA_GROUP_ITEMS,
  payload: { id, params }
})

const clearGetMediaGroupItemsInfoAction = () => ({
  type: types.CLEAR_GET_MEDIA_GROUP_ITEMS_INFO
})

const postMediaGroupItemAction = data => ({
  type: types.POST_MEDIA_GROUP_ITEM,
  payload: data
})

const clearPostMediaGroupItemInfoAction = () => ({
  type: types.CLEAR_POST_MEDIA_GROUP_ITEM_INFO
})

const deleteMediaGroupItemAction = data => ({
  type: types.DELETE_MEDIA_GROUP_ITEM,
  payload: data
})

const clearDeleteMediaGroupItemInfoAction = () => ({
  type: types.CLEAR_DELETE_MEDIA_GROUP_ITEM_INFO
})

const getMediaItemById = id => ({
  type: types.GET_MEDIA_ITEM_BY_ID,
  data: id
})

const getFeatureMediaItemsAction = data => ({
  type: types.GET_FEATURE_MEDIA_ITEMS,
  payload: data
})

const clearGetFeatureMediaItemsInfoAction = () => ({
  type: types.CLEAR_GET_FEATURE_MEDIA_ITEMS_INFO
})

export function getMediaCapAlert() {
  return {
    type: types.REQUEST_MEDIA_CAP_ALERT
  }
}

export function mediaCapAlertSuccess(data) {
  return {
    type: types.MEDIA_CAP_ALERT_SUCCESS,
    payload: data
  }
}

export function mediaCapAlertError(error) {
  return {
    type: types.MEDIA_CAP_ALERT_ERROR,
    payload: error
  }
}

export {
  getMediaLibraryPref,
  getMediaItemsAction,
  getMediaGroupsAction,
  putMediaLibraryPref,
  addMedia,
  editMedia,
  clearAddedMedia,
  clearEditMedia,
  clearMediaItemStatus,
  closeMediaPreview,
  showMediaPreview,
  getMediaPreview,
  generateMediaPreview,
  clearGetMediaGroupsInfoAction,
  getMediaGroupItemsAction,
  clearGetMediaGroupItemsInfoAction,
  postMediaGroupItemAction,
  clearPostMediaGroupItemInfoAction,
  deleteMediaGroupItemAction,
  clearDeleteMediaGroupItemInfoAction,
  getMediaItemById,
  clearMediaItemsAction,
  clearMediaGroupItemsInfo,
  clearGetMediaItemsInfoAction,
  getFeatureMediaItemsAction,
  clearGetFeatureMediaItemsInfoAction,
  clearMediaPut,
  clearMediaPreview
}
