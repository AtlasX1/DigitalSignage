import * as types from '../actions'

export default (state = {}, action) => {
  const response = action.response
  const error = action.error

  switch (action.type) {
    case types.IMPERSONATE_USER_SUCCESS:
      return { ...state, response }
    case types.IMPERSONATE_USER_ERROR:
      return { ...state, error }
    default:
      return state
  }
}
