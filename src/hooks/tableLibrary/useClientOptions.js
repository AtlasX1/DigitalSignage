import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getItems } from 'actions/clientActions'
import { ALL_RECORD } from 'constants/library'

const useClientOptions = () => {
  const dispatch = useDispatch()

  const clients = useSelector(
    ({
      clients: {
        items: { response: clients }
      }
    }) => clients
  ).map(({ id: value, name: label }) => ({
    value,
    label: `${label} [${value}]`
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

  return clients
}

export default useClientOptions
