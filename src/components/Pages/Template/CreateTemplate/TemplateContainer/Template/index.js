import React, { useCallback, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import { withStyles, Grid, Typography } from '@material-ui/core'

import TemplateItem from './TemplateItem'

import {
  setCurrentTemplateItem,
  deleteTemplateItem
} from 'actions/createTemplateActions'
import { calculateSizeForRender } from 'utils/createTemplate'
import { createTemplateConstants } from 'constants/index'

import 'styles/template/_templateAreaPatterns.scss'

const styles = theme => {
  const { palette, type } = theme
  return {
    templateRoot: {
      padding: '63px 17px',
      overflow: 'auto'
    },
    viewAreaContainer: {
      boxShadow: '0 2px 7px 0 rgba(0, 0, 0, 0.12)',
      borderStyle: 'solid',
      borderWidth: '5px',
      borderImageSource:
        palette[type].pages.createTemplate.template.viewContainer.border,
      borderColor:
        palette[type].pages.createTemplate.template.viewContainer.border,
      borderImageSlice: '1',
      background:
        palette[type].pages.createTemplate.template.viewContainer.background
    },
    viewArea: {
      width: '100%',
      minWidth: '100%',
      height: '100%',
      minHeight: '100%',
      position: 'relative',
      display: 'flex',
      flexWrap: 'wrap',
      overflow: 'hidden'
    },
    containerGridWrapper: {
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      position: 'relative'
    },
    containerGridVideowall: {
      position: 'absolute'
    },
    verticalGridLine: {
      position: 'absolute',
      left: 0,
      width: '100%',
      borderTop: '1px dashed #e4e4e4',
      '& > span': {
        position: 'absolute',
        color: 'lightgray',
        fontSize: 12
      }
    },
    horizontalGridLine: {
      position: 'absolute',
      top: 0,
      height: '100%',
      borderLeft: '1px dashed #e4e4e4',
      '& > span': {
        position: 'absolute',
        color: 'lightgray',
        fontSize: 12
      }
    }
  }
}

const Template = ({
  classes,
  rootClass,
  container,
  items,
  multiplier,
  currentItemId,
  selectedItems,
  deleteTemplateItem,
  setCurrentTemplateItem
}) => {
  const onBackspaceClickHandler = useCallback(
    e => {
      if (e.keyCode !== 46 || currentItemId === -1) return

      deleteTemplateItem(currentItemId)
    },
    [currentItemId, deleteTemplateItem]
  )

  useEffect(() => {
    window.addEventListener('keydown', onBackspaceClickHandler, false)
    return () => {
      window.removeEventListener('keydown', onBackspaceClickHandler)
    }
  }, [onBackspaceClickHandler])

  const onAreaClickHandler = useCallback(
    e => {
      if (
        e.target.id === 'create-template-view-area' ||
        e.target.id === 'create-template-pattern' ||
        (e.target.classList &&
          e.target.classList.contains('create-template-video-wall-grid'))
      ) {
        setCurrentTemplateItem(-1)
      }
    },
    [setCurrentTemplateItem]
  )

  const itemsKeys = useMemo(() => Object.keys(items), [items])
  const orientation = useMemo(() => container.orientation.toUpperCase(), [
    container.orientation
  ])
  const landscape = useMemo(
    () => orientation === createTemplateConstants.LANDSCAPE,
    [orientation]
  )

  const videoWall = container.videoWall

  const size = {
    width: landscape ? container.size.width : container.size.height,
    height: landscape ? container.size.height : container.size.width
  }

  const convertedSize = calculateSizeForRender({
    ...size,
    multiplier,
    videoWall
  })

  const containerGrid = useCallback(
    (isReturnCoords = false) => {
      const verticalRowsCount = landscape ? 9 : 16
      const horizontalRowsCount = landscape ? 16 : 9
      const verticalGap = convertedSize.height / (verticalRowsCount + 1)
      const horizontalGap = convertedSize.width / (horizontalRowsCount + 1)
      const vGap = []
      const hGap = []

      for (let i = 0; i < verticalRowsCount; i++) {
        if (vGap[i - 1]) {
          vGap.push(vGap[i - 1] + verticalGap)
        } else {
          vGap.push(verticalGap)
        }
      }

      for (let i = 0; i < horizontalRowsCount; i++) {
        if (hGap[i - 1]) {
          hGap.push(hGap[i - 1] + horizontalGap)
        } else {
          hGap.push(horizontalGap)
        }
      }

      if (isReturnCoords) {
        return {
          verticalCoords: vGap,
          horizontalCoords: hGap
        }
      }

      return (
        <div
          className={classNames(classes.containerGridWrapper, {
            [classes.containerGridVideowall]: videoWall.active
          })}
        >
          {vGap.map((t, i) => (
            <div
              className={classNames(classes.verticalGridLine, 'grid-v-line')}
              style={{ top: `${t}px` }}
              key={'y' + i}
            />
          ))}
          {hGap.map((l, i) => (
            <div
              className={classNames(classes.horizontalGridLine, 'grid-h-line')}
              style={{ left: `${l}px` }}
              key={'x' + i}
            />
          ))}
        </div>
      )
    },
    [classes, convertedSize, landscape, videoWall.active]
  )

  const renderVideoWallGrid = useMemo(() => {
    if (!videoWall.active) return null

    let grid = []

    const width = convertedSize.width / videoWall.props.x
    const height = convertedSize.height / videoWall.props.y
    const cellCount = videoWall.props.x * videoWall.props.y

    for (let i = 0; i < cellCount; i++) {
      grid.push(
        <Grid
          container
          justify="center"
          alignItems="center"
          key={`create-template-video-wall-grid-${i}`}
          className="create-template-video-wall-grid"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            background: `rgba(238, 238, 238, ${1 - i / cellCount})`,
            userSelect: 'none'
          }}
        >
          <Typography
            style={{ fontSize: `${height / 2}px`, fontWeight: '500' }}
          >
            {i + 1}
          </Typography>
        </Grid>
      )
    }

    return grid
  }, [
    convertedSize.width,
    convertedSize.height,
    videoWall.props.x,
    videoWall.props.y,
    videoWall.active
  ])

  const containerJustify =
    Math.max(convertedSize.width, convertedSize.height) > 1280
      ? 'flex-start'
      : 'center'

  const itemList = useMemo(
    () =>
      !!itemsKeys.length &&
      itemsKeys.map(itemKey => (
        <TemplateItem
          key={itemKey}
          {...items[itemKey]}
          multiplier={multiplier}
          showGrid={container.showGrid}
          snapToGrid={container.snapToGrid}
          videoWall={videoWall}
          active={currentItemId === items[itemKey].id}
          anotherActive={
            currentItemId !== items[itemKey].id && currentItemId !== -1
          }
          gridCoords={containerGrid(true)}
          selected={selectedItems.indexOf(items[itemKey].id) !== -1}
        />
      )),
    [
      itemsKeys,
      container.showGrid,
      container.snapToGrid,
      containerGrid,
      currentItemId,
      items,
      multiplier,
      selectedItems,
      videoWall
    ]
  )

  return (
    <Grid
      container
      justify={containerJustify}
      alignItems="center"
      className={[
        classes.templateRoot,
        rootClass,
        'Template-templateRoot-grid'
      ].join(' ')}
    >
      <Grid
        className={classes.viewAreaContainer}
        style={{
          // +10px borders
          minWidth: `${convertedSize.width + 10}px`,
          width: `${convertedSize.width + 10}px`,
          minHeight: `${convertedSize.height + 10}px`,
          height: `${convertedSize.height + 10}px`
        }}
      >
        <div
          className={classes.viewArea}
          id="create-template-view-area"
          onClick={onAreaClickHandler}
          style={{
            [container.pattern === 'original' ? 'background' : '']:
              container.background || '#000'
          }}
        >
          {container.pattern !== 'original' && (
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                zIndex: 0,
                opacity: container.patternOpacity
              }}
              className={container.pattern}
              id="create-template-pattern"
            />
          )}

          {container.showGrid && containerGrid()}

          {renderVideoWallGrid}

          {itemList}
        </div>
      </Grid>
    </Grid>
  )
}

Template.propTypes = {
  classes: PropTypes.object.isRequired,
  rootClass: PropTypes.string,
  container: PropTypes.object.isRequired,
  items: PropTypes.object,
  multiplier: PropTypes.number,
  showGrid: PropTypes.bool,
  currentItemId: PropTypes.number,
  selectedItems: PropTypes.array
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setCurrentTemplateItem, deleteTemplateItem }, dispatch)

export default withStyles(styles)(connect(null, mapDispatchToProps)(Template))
