import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { whiteLabelUtils, windowUtils } from 'utils/index'

const WindowTitleProvider = ({ location }) => {
  const [whiteLabelReducer] = useSelector(state => [state.whiteLabel])
  const whiteLabelInfo = useMemo(() => {
    return whiteLabelUtils.parseReducer(whiteLabelReducer)
  }, [whiteLabelReducer])
  useEffect(() => {
    windowUtils.setTitle(location.pathname, whiteLabelInfo.windowTitle)
  }, [location, whiteLabelInfo])
  return <div />
}

export default withRouter(WindowTitleProvider)
