import { getUserType } from './index'
import { apiConstants } from '../constants'

const getAccessUrlWithoutEnterprise = () => {
  let t = getUserType()

  return t === apiConstants.SYSTEM_USER ? 'system' : 'org'
}

export default getAccessUrlWithoutEnterprise
