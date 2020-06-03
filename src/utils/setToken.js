import clearStorage from './clearStorage'
import { calculateExpires } from './date'

const setToken = (name, type, token, expires) => {
  clearStorage()
  localStorage.setItem(name, `${type} ${token}`)
  localStorage.setItem('expiresIn', calculateExpires(expires))
}

export default setToken
