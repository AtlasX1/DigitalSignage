import { apiConstants } from '../constants'
import { getUserType } from '../utils'

const getAccessUrl = type => {
  let t = type || getUserType()

  return t === apiConstants.SYSTEM_USER
    ? 'system'
    : t === apiConstants.ENTERPRISE_USER
    ? 'enterprise'
    : 'org'
}

export default getAccessUrl
