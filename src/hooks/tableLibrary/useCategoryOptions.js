import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { getCategoriesByFeature } from 'actions/categoriesActions'
import { ALL_RECORD } from 'constants/library'

const useCategoryOptions = feature => {
  useEffect(() => {
    if (!feature) throw console.log('Please pass feature')
  })
  const dispatch = useDispatch()

  const categories = useSelector(
    ({
      categories: {
        categoriesByFeature: {
          [feature]: { response: categories }
        }
      }
    }) => categories
  ).map(({ name, id }) => ({ label: name, value: id }))

  const meta = useSelector(
    ({
      categories: {
        categoriesByFeature: {
          [feature]: { meta }
        }
      }
    }) => meta
  )

  useEffect(() => {
    if (isEmpty(categories) && feature)
      dispatch(getCategoriesByFeature(feature, { limit: ALL_RECORD }))
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (meta.total > meta.count) {
      dispatch(getCategoriesByFeature(feature, { limit: meta.total }))
    }
    // eslint-disable-next-line
  }, [feature, meta.count, meta.total])

  return categories
}

export default useCategoryOptions
