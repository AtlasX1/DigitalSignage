import * as types from '../actions'

export default (state = [], action) => {
  const response = action.response
  const error = action.error

  switch (action.type) {
    case types.LOGOUT_USER_ACCESS:
      return { ...state, response }
    case types.LOGOUT_USER_ERROR:
      return { ...state, error }
    case types.CLEAR_LOGOUT_INFO:
      return []
    default:
      return state
  }
}
