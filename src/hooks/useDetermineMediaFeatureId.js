import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo } from 'react'
import { isEmpty } from 'lodash'
import { getConfigMediaCategory } from 'actions/configActions'
import { getAllowedFeatureId } from 'utils/mediaUtils'

const useDetermineMediaFeatureId = (category, group) => {
  const configMediaCategory = useSelector(
    ({ config: { configMediaCategory } }) => configMediaCategory
  )
  const dispatch = useDispatch()

  useEffect(() => {
    if (isEmpty(configMediaCategory.response)) {
      dispatch(getConfigMediaCategory())
    }
    // eslint-disable-next-line
  }, [])

  return useMemo(
    () => getAllowedFeatureId(configMediaCategory, category, group),
    [category, configMediaCategory, group]
  )
}

export default useDetermineMediaFeatureId
