import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getConfigClientType } from 'actions/configActions'

const useClientTypeOptions = () => {
  const dispatch = useDispatch()

  const clientTypes = useSelector(
    ({
      config: {
        clientTypes: { response: clientTypes }
      }
    }) => clientTypes
  ).map(({ id: value, title: label }) => ({ value, label }))

  useEffect(() => {
    dispatch(getConfigClientType())
  }, [dispatch])

  return clientTypes
}

export default useClientTypeOptions
