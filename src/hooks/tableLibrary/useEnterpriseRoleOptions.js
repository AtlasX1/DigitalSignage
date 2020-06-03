import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getConfigEnterpriseRole } from 'actions/configActions'
import { isEmpty } from 'lodash'

const useEnterpriseRoleOptions = () => {
  const dispatch = useDispatch()

  const roles = useSelector(
    ({
      config: {
        enterpriseRole: { response: enterpriseRoles }
      }
    }) => enterpriseRoles
  ).map(({ displayName: label, id: value }) => ({ label, value }))

  useEffect(() => {
    if (isEmpty(roles)) dispatch(getConfigEnterpriseRole())
    // eslint-disable-next-line
  }, [])

  return roles
}

export default useEnterpriseRoleOptions
