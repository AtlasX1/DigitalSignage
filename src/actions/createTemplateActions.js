import * as types from './index'

export const resetTemplatePage = () => ({
  type: types.RESET_TEMPLATE_CONTAINER
})

export const updateTemplateContainer = data => ({
  type: types.UPDATE_TEMPLATE_CONTAINER,
  payload: data
})

export const setTemplateContainerOrientation = orientation => ({
  type: types.SET_TEMPLATE_CONTAINER_ORIENTATION,
  payload: orientation
})

export const setTemplateContainerSize = size => ({
  type: types.SET_TEMPLATE_CONTAINER_SIZE,
  payload: size
})

export const setTemplateContainerVideoWall = value => ({
  type: types.SET_TEMPLATE_CONTAINER_VIDEO_WALL,
  payload: value
})

export const setCurrentTemplateItem = id => ({
  type: types.SET_CURRENT_TEMPLATE_ITEM,
  payload: id
})

export const updateCurrentTemplateItem = (field, data) => ({
  type: types.UPDATE_CURRENT_TEMPLATE_ITEM,
  payload: { field, data }
})

export const setCurrentTemplateItemSize = (field, value) => ({
  type: types.SET_CURRENT_TEMPLATE_ITEM_SIZE,
  payload: { field, value }
})

export const setCurrentTemplateItemPosition = (field, value) => ({
  type: types.SET_CURRENT_TEMPLATE_ITEM_POSITION,
  payload: { field, value }
})

export const setCurrentTemplateItemAlignment = alignment => ({
  type: types.SET_CURRENT_TEMPLATE_ITEM_ALIGNMENT,
  payload: alignment
})

export const setCurrentTemplateItemRotation = rotation => ({
  type: types.SET_CURRENT_TEMPLATE_ITEM_ROTATION,
  payload: rotation
})

export const flipCurrentTemplateItem = flip => ({
  type: types.FLIP_CURRENT_TEMPLATE_ITEM,
  payload: flip
})

export const deleteTemplateItems = () => ({
  type: types.DELETE_TEMPLATE_ITEMS
})

export const deleteTemplateItem = id => ({
  type: types.DELETE_TEMPLATE_ITEM,
  payload: id
})

export const addTemplateItem = payload => ({
  type: types.ADD_TEMPLATE_ITEM,
  payload
})

export const copyTemplateItem = id => ({
  type: types.COPY_TEMPLATE_ITEM,
  payload: id
})

export const moveTemplateItemForward = id => ({
  type: types.MOVE_TEMPLATE_ITEM_FORWARD,
  payload: id
})

export const moveTemplateItemBack = id => ({
  type: types.MOVE_TEMPLATE_ITEM_BACK,
  payload: id
})

export const zoomInTemplateContainer = () => ({
  type: types.ZOOM_IN_TEMPLATE_CONTAINER
})

export const zoomOutTemplateContainer = () => ({
  type: types.ZOOM_OUT_TEMPLATE_CONTAINER
})

export const setMultiplier = value => ({
  type: types.SET_MULTIPLIER,
  payload: value
})

export const lockTemplateItem = id => ({
  type: types.LOCK_TEMPLATE_ITEM,
  payload: id
})

export const unlockTemplateItem = id => ({
  type: types.UNLOCK_TEMPLATE_ITEM,
  payload: id
})

export const toggleTemplateItemToSelected = id => ({
  type: types.TOGGLE_TEMPLATE_ITEM_TO_SELECTED,
  payload: id
})

// export const clearSelectedItems = () => ({
//   type: types.CLEAR_SELECTED_ITEMS
// })
