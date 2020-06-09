import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getItems } from 'actions/clientUsersActions'
import { ALL_RECORD } from 'constants/library'

const useClientUserOptions = () => {
  const dispatch = useDispatch()

  const clientUsers = useSelector(
    ({
      clientUsers: {
        items: { response: clients }
      }
    }) => clients
  ).map(({ id: value, firstName, lastName }) => ({
    value,
    label: `${firstName} ${lastName} [${value}]`
  }))

  const meta = useSelector(
    ({
      clients: {
        items: { meta }
      }
    }) => meta
  )

  useEffect(() => {
    if (meta.total > ALL_RECORD) {
      dispatch(
        getItems({
          limit: meta.total
        })
      )
    }
  }, [dispatch, meta.total])

  useEffect(() => {
    dispatch(
      getItems({
        limit: ALL_RECORD
      })
    )

    // eslint-disable-next-line
  }, [dispatch])

  return clientUsers
}

export default useClientUserOptions
