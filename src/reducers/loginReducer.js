import * as types from '../actions'

export default (state = [], action) => {
  switch (action.type) {
    case types.LOGIN_USER_SUCCESS:
      return { ...state, response: action.payload }
    case types.LOGIN_USER_ERROR:
      return { ...state, error: action.payload }
    case types.CLEAR_LOGIN_INFO:
      return []
    default:
      return state
  }
}
