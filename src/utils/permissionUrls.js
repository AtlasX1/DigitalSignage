import getUserRoleLevel from 'utils/getUserRoleLevel'

const getUrlPrefix = url => {
  const level = getUserRoleLevel()

  return `/${level}/${url}`
}

export default getUrlPrefix
