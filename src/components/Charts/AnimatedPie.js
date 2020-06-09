import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'

import { Pie } from '@nivo/pie'

const TICK_INTERVAL = 16

const AnimatedPie = ({
  data,
  startAngle = 0,
  endAngle = 360,
  animationDuration = 1000,
  fit = false,
  chartComponent: ChartComponent = Pie,
  ...props
}) => {
  const [localAngle, setLocalAngle] = useState(startAngle)
  const timeoutId = useRef(null)

  const angleIncerment = useMemo(
    () =>
      (endAngle - startAngle) / Math.ceil(animationDuration / TICK_INTERVAL),
    [animationDuration, startAngle, endAngle]
  )

  const animationTick = useCallback(
    localAngle => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
        timeoutId.current = null
      }
      const newAngle = localAngle + angleIncerment

      if (newAngle >= endAngle) {
        setLocalAngle(endAngle)
      } else {
        setLocalAngle(newAngle)
        timeoutId.current = setTimeout(animationTick, TICK_INTERVAL, newAngle)
      }
    },
    [angleIncerment, endAngle]
  )

  useEffect(() => {
    setLocalAngle(startAngle)
    animationTick(startAngle)
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
    }
    //eslint-disable-next-line
  }, [data, startAngle, endAngle, animationDuration])

  return (
    <ChartComponent
      data={data}
      startAngle={startAngle}
      endAngle={localAngle}
      fit={fit}
      {...props}
    />
  )
}

export default AnimatedPie
