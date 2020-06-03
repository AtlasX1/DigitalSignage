import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getConfigSystemRole } from 'actions/configActions'
import { isEmpty } from 'lodash'

const useSystemRoleOptions = () => {
  const dispatch = useDispatch()

  const roles = useSelector(
    ({
      config: {
        systemRole: { response: systemRoles }
      }
    }) => systemRoles
  ).map(({ displayName: label, id: value }) => ({ label, value }))

  useEffect(() => {
    if (isEmpty(roles)) dispatch(getConfigSystemRole())
    // eslint-disable-next-line
  }, [])

  return roles
}

export default useSystemRoleOptions
