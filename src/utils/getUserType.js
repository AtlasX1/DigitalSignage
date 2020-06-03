import { apiConstants } from '../constants'

const getUserType = () => {
  const system = !!localStorage.getItem(apiConstants.SYSTEM_USER_TOKEN_NAME)
  const enterprise = !!localStorage.getItem(
    apiConstants.ENTERPRISE_USER_TOKEN_NAME
  )

  return system
    ? apiConstants.SYSTEM_USER
    : enterprise
    ? apiConstants.ENTERPRISE_USER
    : apiConstants.ORG_USER
}

export default getUserType
