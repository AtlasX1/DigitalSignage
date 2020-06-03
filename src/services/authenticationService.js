import api from './api'
import { errorHandler, getAccessUrl } from '../utils'

export const loginUserService = async request => {
  try {
    const {
      user: { username, password, type }
    } = request

    const response = await api({
      method: 'POST',
      url: `${getAccessUrl(type)}/login`,
      data: { username, password }
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

export const loginSocialService = async request => {
  try {
    const { provider, token, code } = request

    const response = await api({
      method: 'POST',
      url: '/socialLogin',
      data: { provider, token, code }
    })

    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

export const logoutUserService = async () => {
  try {
    const response = await api({
      method: 'POST',
      url: '/logout'
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

export const updateTokenService = async () => {
  try {
    const response = await api({
      method: 'POST',
      url: '/refresh'
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

export const recovery = async email => {
  try {
    const response = await api({
      method: 'POST',
      url: '/recovery',
      data: {
        email: email
      }
    })

    return response
  } catch (error) {
    throw errorHandler(error)
  }
}

export const reset = async data => {
  try {
    const response = await api({
      method: 'POST',
      url: '/reset',
      data: data
    })

    return response
  } catch (error) {
    throw errorHandler(error)
  }
}

export const impersonateUserService = async userId => {
  try {
    const response = await api({
      method: 'POST',
      url: `/user/${userId}/impersonate`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}

export const impersonateSystemUserService = async userId => {
  try {
    const response = await api({
      method: 'POST',
      url: `/client/user/${userId}/impersonate`
    })

    return response.data
  } catch (error) {
    throw errorHandler(error)
  }
}
