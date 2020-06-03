import * as types from '../actions'

export default (state = {}, action) => {
  const response = action.response
  const error = action.error

  switch (action.type) {
    case types.RESET_PASSWORD_SUCCESS:
      return { response }
    case types.RESET_PASSWORD_ERROR:
      return { error }
    default:
      return state
  }
}
