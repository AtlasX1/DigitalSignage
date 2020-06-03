import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import roles from 'utils/roles'

const useUserRole = () => {
  const [role, setRole] = useState({
    org: false,
    system: false,
    enterprise: false
  })

  const details = useSelector(({ user: { details } }) => details)

  useEffect(() => {
    if (details.response) {
      setRole(roles.parse(details.response.role))
    }
  }, [details])

  return role
}

export default useUserRole
