import * as types from '../actions'

const initialState = {
  height: 0
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_HEIGHT_COMPONENT:
      state = {
        height: action.payload
      }
      return state
    default:
      return state
  }
}
