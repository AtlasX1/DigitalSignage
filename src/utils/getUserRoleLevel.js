import store from 'store/configureStore'

import { getAccessUrl } from '../utils'

const getUserRoleLevel = () => {
  const {
    user: { details: userDetails }
  } = store.getState()

  const fallbackRole = getAccessUrl()

  return userDetails.response ? userDetails.response.role.level : fallbackRole
}

export default getUserRoleLevel
