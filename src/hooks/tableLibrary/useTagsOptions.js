import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getItems } from 'actions/tagsActions'
import { isEmpty } from 'lodash'
import { ALL_RECORD } from 'constants/library'
const useTagsOptions = () => {
  const dispatch = useDispatch()

  const tags = useSelector(
    ({
      tags: {
        items: { response: tags }
      }
    }) => tags
  ).map(({ id: value, tag: label }) => ({ value, label }))

  const meta = useSelector(
    ({
      tags: {
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
    if (isEmpty(tags)) {
      dispatch(
        getItems({
          limit: ALL_RECORD
        })
      )
    }
    // eslint-disable-next-line
  }, [dispatch])

  return tags
}

export default useTagsOptions
