import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const useDeterminePermissions = findPermission => {
  const [permission, setPermission] = useState({
    create: false,
    read: false,
    update: false,
    delete: false
  })

  const details = useSelector(({ user: { details } }) => details)

  useEffect(() => {
    if (
      details.response &&
      details.response.permissions.hasOwnProperty(findPermission)
    ) {
      setPermission(details.response.permissions[findPermission])
    }
    // eslint-disable-next-line
  }, [details])

  return permission
}

export default useDeterminePermissions
