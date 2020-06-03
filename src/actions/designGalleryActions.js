import * as types from './index'

const postDesignGallery = ({ data }) => ({
  type: types.POST_DESIGN_GALLERY,
  data
})

const putDesignGallery = ({ id, data }) => ({
  type: types.PUT_DESIGN_GALLERY,
  data,
  meta: {
    id
  }
})

const getDesignGallery = id => ({
  type: types.GET_DESIGN_GALLERY,
  data: id
})

const clearDesignGallery = meta => ({
  type: types.CLEAR_DESIGN_GALLERY,
  meta
})

export {
  postDesignGallery,
  putDesignGallery,
  getDesignGallery,
  clearDesignGallery
}
