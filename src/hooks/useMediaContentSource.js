import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useDetermineMediaFeatureId from 'hooks/useDetermineMediaFeatureId'
import {
  clearMediaContentSource,
  getContentSourceOfMediaFeatureById
} from 'actions/configActions'

const useMediaContentSource = (category, group) => {
  const [isReceived, setReceived] = useState(false)
  const featureId = useDetermineMediaFeatureId(category, group)
  const dispatch = useDispatch()
  const response = useSelector(
    ({
      config: {
        contentSourceOfMediaFeature: { response }
      }
    }) => response
  )

  useEffect(
    () => {
      if (featureId && !isReceived) {
        dispatch(getContentSourceOfMediaFeatureById(featureId))
        setReceived(true)
      }
      return () => dispatch(clearMediaContentSource())
    },
    // eslint-disable-next-line
    [featureId]
  )

  return { contentSources: response, featureId }
}

export default useMediaContentSource
