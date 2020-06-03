import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getClientPackages } from 'actions/clientPackagesActions'
import { ALL_RECORD } from 'constants/library'

const useClientPackagesOptions = () => {
  const [fetched, setFetched] = useState(false)
  const dispatch = useDispatch()

  const clientPackages = useSelector(
    ({
      clientPackage: {
        items: { response: clientPackages }
      }
    }) => clientPackages
  )

  const transformClientPackage = useMemo(
    () =>
      clientPackages.map(({ id: value, title: label }) => ({ value, label })),
    [clientPackages]
  )

  const getFeatureIds = useCallback(
    findId =>
      clientPackages
        .find(({ id }) => id === Number.parseInt(findId))
        .feature.map(({ id }) => id),
    [clientPackages]
  )

  const meta = useSelector(
    ({
      clientPackage: {
        items: { meta }
      }
    }) => meta
  )

  useEffect(() => {
    if (meta.total > ALL_RECORD && fetched) {
      dispatch(
        getClientPackages({
          limit: meta.total
        })
      )
    }
  }, [dispatch, fetched, meta.total])

  useEffect(() => {
    dispatch(
      getClientPackages({
        limit: ALL_RECORD
      })
    )
    setFetched(true)
  }, [dispatch])

  return { values: transformClientPackage, getFeatureIds }
}

export default useClientPackagesOptions
