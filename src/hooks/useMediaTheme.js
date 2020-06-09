import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useDetermineMediaFeatureId from 'hooks/useDetermineMediaFeatureId'
import {
  clearMediaThemes,
  getThemeOfMediaFeatureById
} from 'actions/configActions'

const useMediaTheme = (category, group) => {
  const [isReceived, setReceived] = useState(false)
  const featureId = useDetermineMediaFeatureId(category, group)
  const dispatch = useDispatch()
  const response = useSelector(
    ({
      config: {
        themeOfMedia: { response }
      }
    }) => response
  )

  useEffect(
    () => {
      if (featureId && !isReceived) {
        dispatch(getThemeOfMediaFeatureById(featureId))
        setReceived(true)
      }
      return () => dispatch(clearMediaThemes())
    },
    // eslint-disable-next-line
    [featureId]
  )

  return { themes: response, featureId }
}

export default useMediaTheme
