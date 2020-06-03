import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGroupsByEntity } from 'actions/groupActions'
import { ALL_RECORD } from 'constants/library'

const useGroupsOptions = entity => {
  const dispatch = useDispatch()

  const groups = useSelector(
    ({
      group: {
        [entity]: { response }
      }
    }) => response
  ).map(({ id: value, title: label }) => ({ value, label }))

  const meta = useSelector(
    ({
      group: {
        [entity]: { meta }
      }
    }) => meta
  )

  useEffect(() => {
    if (meta.total > ALL_RECORD) {
      dispatch(
        getGroupsByEntity(entity, {
          limit: meta.total
        })
      )
    }
  }, [dispatch, entity, meta.total])

  useEffect(() => {
    dispatch(
      getGroupsByEntity(entity, {
        limit: ALL_RECORD
      })
    )
  }, [dispatch, entity])

  return groups
}

export default useGroupsOptions
