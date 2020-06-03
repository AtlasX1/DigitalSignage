import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import classNames from 'classnames'

import PreviewGridsItem from './PreviewGridsItem'
import { useBottomScrollListener } from 'react-bottom-scroll-listener'

const useStyles = makeStyles({
  backgrounds: {
    width: '100%',
    display: ({ isVisible }) => (isVisible ? 'flex' : 'none'),
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    position: 'relative',
    '&.scroll-container': {
      padding: '0 8px 0 13px',
      width: 'calc(100% + 21px)',
      marginLeft: '-13px',
      marginRight: '-8px'
    }
  },
  textInfo: {
    width: '100%',
    fontSize: 12,
    lineHeight: '14px',
    color: '#5C697F',
    textAlign: 'center',
    padding: '10px'
  }
})

const PreviewGrids = props => {
  const {
    grids,
    isVisible,
    isLoading,
    onPreviewClick,
    colWidth,
    scrollPosition,
    onContentScrollEnd = () => {},
    isOwnScroll = true
  } = props
  const classes = useStyles({ isVisible })
  const gridsRef = useBottomScrollListener(onContentScrollEnd)

  useEffect(() => {
    if (gridsRef && scrollPosition === 0) {
      gridsRef.current.scrollTop = scrollPosition
    }
    // eslint-disable-next-line
  }, [scrollPosition])

  return useMemo(() => {
    return (
      <div
        ref={gridsRef}
        className={classNames(classes.backgrounds, {
          'scroll-container': isOwnScroll
        })}
      >
        {grids.map((grid, key) => (
          <PreviewGridsItem
            key={key}
            grid={grid}
            onClick={onPreviewClick}
            colWidth={colWidth}
          />
        ))}
        {!grids.length && !isLoading && (
          <div className={classes.textInfo}>Nothing to show!</div>
        )}
      </div>
    )
    // eslint-disable-next-line
  }, [props])
}

PreviewGrids.propTypes = {
  grids: PropTypes.array,
  isVisible: PropTypes.bool,
  isLoading: PropTypes.bool,
  onPreviewClick: PropTypes.func,
  colWidth: PropTypes.number
}

export default PreviewGrids
