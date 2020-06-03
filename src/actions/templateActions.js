import * as types from './index'

const postTemplate = data => ({
  type: types.POST_TEMPLATE,
  data
})

const editTemplate = ({ id, data }) => ({
  type: types.PUT_TEMPLATE,
  data,
  meta: {
    id
  }
})

const getTemplate = id => ({
  type: types.GET_TEMPLATE,
  data: id
})

const getTemplateItemsAction = params => ({
  type: types.GET_TEMPLATE_ITEMS,
  params
})

const getTemplateLibraryPrefAction = () => ({
  type: types.GET_TEMPLATE_PREFERENCE
})

const putTemplateLibraryPrefAction = data => ({
  type: types.PUT_TEMPLATE_PREFERENCE,
  payload: data
})

const getTemplateGroupsAction = () => ({
  type: types.GET_TEMPLATE_GROUPS
})

const clearGetTemplateGroupsInfoAction = () => ({
  type: types.CLEAR_GET_TEMPLATE_GROUPS_INFO
})

const getTemplateGroupItemsAction = id => ({
  type: types.GET_TEMPLATE_GROUP_ITEMS,
  payload: id
})

const clearGetTemplateGroupItemsInfoAction = () => ({
  type: types.CLEAR_GET_TEMPLATE_GROUP_ITEMS_INFO
})

const postTemplateGroupItemAction = data => ({
  type: types.POST_TEMPLATE_GROUP_ITEM,
  payload: data
})

const clearPostTemplateGroupItemInfoAction = () => ({
  type: types.CLEAR_POST_TEMPLATE_GROUP_ITEM_INFO
})

const deleteTemplateGroupItemAction = data => ({
  type: types.DELETE_TEMPLATE_GROUP_ITEM,
  payload: data
})

const clearDeleteTemplateGroupItemInfoAction = () => ({
  type: types.CLEAR_DELETE_TEMPLATE_GROUP_ITEM_INFO
})

const clearTemplateItem = () => ({
  type: types.CLEAR_TEMPLATE_ITEM
})

const clearResponseInfo = () => ({
  type: types.CLEAR_TEMPLATE_RESPONSE_INFO
})

const cloneTemplate = data => ({
  type: types.CLONE_TEMPLATE,
  data
})

const deleteTemplate = id => ({
  type: types.DELETE_TEMPLATE,
  id
})

const deleteSelectedTemplate = ids => ({
  type: types.DELETE_SELECTED_TEMPLATE,
  ids
})

const clearTemplateGroupItemsInfo = () => ({
  type: types.CLEAR_TEMPLATE_GROUP_ITEMS_RESPONSE_INFO
})

export {
  clearTemplateItem,
  postTemplate,
  editTemplate,
  getTemplate,
  getTemplateItemsAction,
  getTemplateLibraryPrefAction,
  putTemplateLibraryPrefAction,
  getTemplateGroupsAction,
  clearGetTemplateGroupsInfoAction,
  getTemplateGroupItemsAction,
  clearGetTemplateGroupItemsInfoAction,
  postTemplateGroupItemAction,
  clearPostTemplateGroupItemInfoAction,
  deleteTemplateGroupItemAction,
  clearDeleteTemplateGroupItemInfoAction,
  clearResponseInfo,
  cloneTemplate,
  deleteTemplate,
  deleteSelectedTemplate,
  clearTemplateGroupItemsInfo
}
