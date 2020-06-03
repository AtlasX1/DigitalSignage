import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { getConfigOrgRole } from 'actions/configActions'

const useOrgRoleOptions = () => {
  const dispatch = useDispatch()

  const roles = useSelector(
    ({
      config: {
        configOrgRole: { response: orgRoles }
      }
    }) => orgRoles
  ).map(({ displayName: label, id: value }) => ({ label, value }))

  useEffect(() => {
    if (isEmpty(roles)) dispatch(getConfigOrgRole())
    // eslint-disable-next-line
  }, [])

  return roles
}

export default useOrgRoleOptions
