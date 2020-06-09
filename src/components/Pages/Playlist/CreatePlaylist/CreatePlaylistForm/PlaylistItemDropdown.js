import React, { useMemo } from 'react'
import { MediaActionDropdown } from 'components/Media'

const PlaylistItemDropdown = ({
  item,
  transitions,
  selectedTransition,
  ...props
}) => {
  const defaultTransitionId = useMemo(() => {
    if (!transitions || !transitions.length) {
      return 0
    }
    const defaultTransition = transitions.find(
      ({ label }) => label === selectedTransition
    )
    return defaultTransition ? defaultTransition.id : 0
  }, [transitions, selectedTransition])

  return (
    <MediaActionDropdown
      transitionId={item.transitionId || defaultTransitionId}
      daypartStartTime={item.daypartStartTime}
      daypartEndTime={item.daypartEndTime}
      playtime={item.playtime}
      transitions={transitions}
      selectedTransition={selectedTransition}
      {...props}
    />
  )
}
export default PlaylistItemDropdown
