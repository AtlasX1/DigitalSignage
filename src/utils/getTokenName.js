import { getUserType } from 'utils/index'
import { apiConstants } from 'constants/index'

export default () => {
  const userType = getUserType()
  return userType === apiConstants.SYSTEM_USER
    ? apiConstants.SYSTEM_USER_TOKEN_NAME
    : userType === apiConstants.ENTERPRISE_USER
    ? apiConstants.ENTERPRISE_USER_TOKEN_NAME
    : apiConstants.ORG_USER_TOKEN_NAME
}
