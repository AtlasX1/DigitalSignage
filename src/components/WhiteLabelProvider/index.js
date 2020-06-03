import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { useActions } from 'hooks/index'
import { getWhiteLabel, setWhiteLabel } from 'actions/whiteLabelActions'
import { reducerUtils, whiteLabelUtils } from 'utils/index'

const overlayStyles = {
  width: '100vw',
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1111,
  background: '#fff'
}

const WhiteLabelProvider = () => {
  const [whiteLabelReducer] = useSelector(state => [state.whiteLabel])
  const [getWhiteLabelAction, setWhiteLabelAction] = useActions([
    getWhiteLabel,
    setWhiteLabel
  ])
  const [isLoading, setIsLoading] = useState(true)
  const checkWhiteLabelReducer = useCallback(() => {
    reducerUtils.checkReducer(
      whiteLabelReducer,
      whiteLabelUtils.sendRequestOrGetFromLocalStorage(
        getWhiteLabelAction,
        setWhiteLabelAction
      )
    )
  }, [whiteLabelReducer, getWhiteLabelAction, setWhiteLabelAction])
  const handleWhiteLabelReducerResponse = useCallback(
    data => {
      whiteLabelUtils.setInfoToLocalStorage(data)
      setIsLoading(false)
    },
    [setIsLoading]
  )
  const handleWhiteLabelReducerError = useCallback(() => {
    whiteLabelUtils.setInfoToLocalStorage({})
    setIsLoading(false)
  }, [setIsLoading])
  const onWhiteLabelReducerChange = useCallback(() => {
    reducerUtils.parse(
      whiteLabelReducer,
      handleWhiteLabelReducerResponse,
      handleWhiteLabelReducerError
    )
  }, [
    whiteLabelReducer,
    handleWhiteLabelReducerResponse,
    handleWhiteLabelReducerError
  ])
  useEffect(checkWhiteLabelReducer, [checkWhiteLabelReducer])
  useEffect(onWhiteLabelReducerChange, [onWhiteLabelReducerChange])
  return isLoading ? <div style={overlayStyles} /> : <div />
}

export default WhiteLabelProvider
