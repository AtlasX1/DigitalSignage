import * as types from 'actions/index'

const getPreferenceByEntity = entity => ({
  type: types.GET_PREFERENCE_BY_ENTITY,
  entity
})

const putPreferenceByEntity = (entity, data) => ({
  type: types.PUT_PREFERENCE_BY_ENTITY,
  entity,
  data
})

export { getPreferenceByEntity, putPreferenceByEntity }
