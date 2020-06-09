import * as types from './index'

const buildSmartPlaylist = data => {
  return {
    type: types.BUILD_SMART_PLAYLIST,
    data
  }
}

const postSmartPlaylist = ({ data }) => ({
  type: types.POST_SMART_PLAYLIST,
  data
})

const putSmartPlaylist = ({ id, data }) => ({
  type: types.PUT_SMART_PLAYLIST,
  data,
  meta: {
    id
  }
})

const clearSmartPlaylist = () => ({
  type: types.CLEAR_ADDED_SMART_PLAYLIST
})

const clearSmartPlaylistStatus = () => ({
  type: types.CLEAR_SMART_PLAYLIST_STATUS
})

export {
  buildSmartPlaylist,
  postSmartPlaylist,
  putSmartPlaylist,
  clearSmartPlaylist,
  clearSmartPlaylistStatus
}
