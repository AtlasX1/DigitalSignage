import { apiConstants } from '../constants'

const clearStorage = () => {
  localStorage.removeItem(apiConstants.ORG_USER_TOKEN_NAME)
  localStorage.removeItem(apiConstants.SYSTEM_USER_TOKEN_NAME)
  localStorage.removeItem(apiConstants.ENTERPRISE_USER_TOKEN_NAME)
  localStorage.removeItem('expiresIn')
}

export default clearStorage
