import getUserRoleLevel from 'utils/getUserRoleLevel'

const getUrlPrefix = url => {
  const level = getUserRoleLevel()

  return `/${level}/${url}`
}

export function getLogoutUrl(pathname) {
  return pathname.includes('system') ? '/system/sign-in' : '/sign-in'
}

export default getUrlPrefix
