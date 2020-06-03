import React, {
  useEffect,
  useState,
  Fragment,
  useCallback,
  useMemo
} from 'react'
import PropTypes from 'prop-types'
import { Rnd } from 'react-rnd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import throttle from 'lodash/throttle'

import { withStyles, Grid, Typography } from '@material-ui/core'
import {
  TouchAppOutlined as TouchIcon,
  Edit as EditIcon
} from '@material-ui/icons'

import { BlueButton } from 'components/Buttons'

import Details from './Details'

import {
  setCurrentTemplateItem,
  updateCurrentTemplateItem,
  toggleTemplateItemToSelected
} from 'actions/createTemplateActions'
import { createTemplateConstants } from 'constants/index'

import 'styles/template/_templateItem.scss'
import {
  calculatePositionForConfig,
  calculatePositionForRender,
  calculateSizeForConfig,
  calculateSizeForRender
} from 'utils/createTemplate'

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden'
  },
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
    color: '#fff'
  },
  labelIcon: {
    height: '30px',
    lineHeight: '30px',
    marginRight: '13px',
    display: 'flex',
    alignItems: 'center'
  },
  labelText: {
    color: '#fff',
    lineHeight: '30px',
    userSelect: 'none'
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 12,
    paddingBottom: 20
  },
  button: {
    minWidth: '32px',
    height: '32px',
    padding: '0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#1c5dca',
    border: 'none',
    marginLeft: '15px',

    '&:hover': {
      background: '#1c5dca'
    }
  },
  buttonIcon: {
    fontSize: '1.2em'
  },
  activeItemBoxContainer: {
    width: '100%',
    height: '100%'
  },
  activeItemBoxHorizontal: {
    position: 'relative',

    '&::before': {
      content: '""',
      display: 'block',
      width: '100%',
      height: 1,
      position: 'absolute',
      left: 0,
      top: '-1px',
      background: 'rgba(0, 0, 0, 0.5)'
    },

    '&::after': {
      content: '""',
      display: 'block',
      width: '100%',
      height: 1,
      position: 'absolute',
      left: 0,
      background: 'rgba(0, 0, 0, 0.5)'
    }
  },
  activeItemBoxVertical: {
    position: 'absolute',

    '&::before': {
      content: '""',
      display: 'block',
      width: 1,
      height: '100%',
      position: 'absolute',
      top: 0,
      left: '-1px',
      background: 'rgba(0, 0, 0, 0.5)'
    },

    '&::after': {
      content: '""',
      display: 'block',
      width: 1,
      height: '100%',
      position: 'absolute',
      top: 0,
      right: '-1px',
      background: 'rgba(0, 0, 0, 0.5)'
    }
  },
  activeItemBoxPoint: {
    width: 10,
    height: 10,
    display: 'block',
    background: '#4287f5',
    position: 'absolute',
    zIndex: 1,
    borderRadius: '50%',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.5)',
    borderStyle: 'solid'
  },
  activeItemBoxPointTopLeft: {
    transform: 'translate(-50%, -50%)'
  },
  activeItemBoxPointTopCenter: {
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  activeItemBoxPointTopRight: {
    right: 0,
    top: 0,
    transform: 'translate(50%, -50%)'
  },
  activeItemBoxPointRightCenter: {
    right: 0,
    top: '50%',
    transform: 'translate(50%, 0)'
  },
  activeItemBoxPointBottomRight: {
    bottom: 0,
    right: 0,
    transform: 'translate(50%, 50%)'
  },
  activeItemBoxPointBottomCenter: {
    bottom: 0,
    left: '50%',
    transform: 'translate(-50%, 50%)'
  },
  activeItemBoxPointBottomLeft: {
    bottom: 0,
    left: 0,
    transform: 'translate(-50%, 50%)'
  },
  activeItemBoxPointLeftCenter: {
    top: '50%',
    left: 0,
    transform: 'translate(-50%, 0)'
  }
}

const TemplateItem = ({
  classes,
  id,
  title,
  icon,
  featureId,
  media,
  touch,
  multiplier,
  videoWall,
  anotherActive,
  gridCoords,
  updateCurrentTemplateItem,
  showGrid,
  snapToGrid,
  position: savedPosition,
  size: savedSize,
  active,
  locked,
  order,
  selected,
  styles = {},
  toggleTemplateItemToSelected,
  setCurrentTemplateItem
}) => {
  const [touchOpened, setTouchOpened] = useState(false)
  const [detailsOpened, setDetailsOpened] = useState(false)
  const [mediaDetailsModal, setMediaDetailsModal] = useState(false)
  const [touchContentModal, setTouchContentModal] = useState(false)
  const [dragAxis, setDragAxis] = useState('both')

  useEffect(() => {
    ;(!showGrid || !snapToGrid) && setDragAxis('both')
  }, [snapToGrid, showGrid])

  const position = useMemo(
    () =>
      calculatePositionForRender({
        ...savedPosition,
        multiplier
      }) || { x: 0, y: 0 },
    [savedPosition, multiplier]
  )

  const size = useMemo(
    () =>
      calculateSizeForRender({ ...savedSize, multiplier }) || {
        width: 0,
        height: 0
      },
    [savedSize, multiplier]
  )

  const onItemClickHandler = useCallback(
    e => {
      if (anotherActive && e.shiftKey) {
        toggleTemplateItemToSelected(id)
      } else {
        setCurrentTemplateItem(id)
      }
    },
    [anotherActive, id, toggleTemplateItemToSelected, setCurrentTemplateItem]
  )

  const enableResizing = useMemo(() => active && !locked, [active, locked])
  const disableDragging = useMemo(() => !active || locked, [active, locked])

  const minSizeToResize = useMemo(
    () => Math.round((styles.borderWidth / multiplier) * 2),
    [styles.borderWidth, multiplier]
  )

  const updateCurrentTemplateItemPosition = useCallback(
    throttle(({ x, y }) => {
      if (savedPosition.x !== x || savedPosition.y !== y) {
        updateCurrentTemplateItem(
          createTemplateConstants.POSITION,
          calculatePositionForConfig({
            x,
            y,
            multiplier
          })
        )
      }
    }, 50),
    [multiplier, updateCurrentTemplateItem]
  )

  const updateCurrentTemplateItemSize = useCallback(
    throttle(({ width, height }) => {
      if (savedSize.width !== width || savedSize.height !== height) {
        updateCurrentTemplateItem(
          createTemplateConstants.SIZE,
          calculateSizeForConfig({ width, height, multiplier })
        )
      }
    }, 50),
    [multiplier, updateCurrentTemplateItem]
  )

  const snapGrid = useCallback(
    ({ x: startX, y: startY, node }) => {
      const { verticalCoords, horizontalCoords } = gridCoords

      const { width, height } = node.getBoundingClientRect()
      const endX = startX + width
      const endY = startY + height

      const startDistancesV = verticalCoords.map(coord =>
        Math.abs(coord - parseInt(startY))
      )
      const startDistancesH = horizontalCoords.map(coord =>
        Math.abs(coord - parseInt(startX))
      )
      const endDistancesV = verticalCoords.map(coord =>
        Math.abs(coord - parseInt(endY))
      )
      const endDistancesH = horizontalCoords.map(coord =>
        Math.abs(coord - parseInt(endX))
      )

      const startMinDistanceVIndex = startDistancesV.indexOf(
        Math.min(...startDistancesV)
      )
      const startMinDistanceHIndex = startDistancesH.indexOf(
        Math.min(...startDistancesH)
      )

      const endMinDistanceVIndex = endDistancesV.indexOf(
        Math.min(...endDistancesV)
      )
      const endMinDistanceHIndex = endDistancesH.indexOf(
        Math.min(...endDistancesH)
      )

      // top left
      if (
        Math.abs(startY - verticalCoords[startMinDistanceVIndex]) < 7 &&
        Math.abs(startX - horizontalCoords[startMinDistanceHIndex]) < 7
      ) {
        updateCurrentTemplateItemPosition({
          x: horizontalCoords[startMinDistanceHIndex],
          y: verticalCoords[startMinDistanceVIndex]
        })
        return setDragAxis('none')
      }
      // bottom right
      if (
        Math.abs(endY - verticalCoords[endMinDistanceVIndex]) < 7 &&
        Math.abs(endX - horizontalCoords[endMinDistanceHIndex]) < 7
      ) {
        updateCurrentTemplateItemPosition({
          x: horizontalCoords[endMinDistanceHIndex] - width,
          y: verticalCoords[endMinDistanceVIndex] - height
        })
        return setDragAxis('none')
      }
      // top
      if (Math.abs(startY - verticalCoords[startMinDistanceVIndex]) < 7) {
        updateCurrentTemplateItemPosition({
          x: startX,
          y: verticalCoords[startMinDistanceVIndex]
        })
        return setDragAxis('x')
      }
      // bottom
      if (Math.abs(endY - verticalCoords[endMinDistanceVIndex]) < 7) {
        updateCurrentTemplateItemPosition({
          x: startX,
          y: verticalCoords[endMinDistanceVIndex] - height
        })
        return setDragAxis('x')
      }
      // left
      if (Math.abs(startX - horizontalCoords[startMinDistanceHIndex]) < 7) {
        updateCurrentTemplateItemPosition({
          x: horizontalCoords[startMinDistanceHIndex],
          y: startY
        })
        return setDragAxis('y')
      }
      // right
      if (Math.abs(endX - horizontalCoords[endMinDistanceHIndex]) < 7) {
        updateCurrentTemplateItemPosition({
          x: horizontalCoords[endMinDistanceHIndex] - width,
          y: startY
        })
        return setDragAxis('y')
      }
    },
    [gridCoords, updateCurrentTemplateItemPosition]
  )

  return (
    <Fragment>
      <Rnd
        size={size}
        position={position}
        onDragStop={(e, d) =>
          updateCurrentTemplateItemPosition({ x: d.x, y: d.y })
        }
        onDrag={(e, d) => {
          updateCurrentTemplateItemPosition({ x: d.x, y: d.y, multiplier })
          snapToGrid && snapGrid(d)
        }}
        onResize={(e, direction, ref, delta, position) => {
          if (touchOpened) setTouchOpened(false)
          if (detailsOpened) setDetailsOpened(false)

          const newSize = {
            width: +ref.style.width.slice(0, -2),
            height: +ref.style.height.slice(0, -2)
          }

          updateCurrentTemplateItemSize(newSize)

          updateCurrentTemplateItemPosition({ x: position.x, y: position.y })
        }}
        onResizeStop={() => {
          updateCurrentTemplateItemPosition(position)
          updateCurrentTemplateItemSize(size)
        }}
        dragAxis={dragAxis}
        bounds="parent"
        enableResizing={{
          bottom: enableResizing,
          bottomLeft: enableResizing,
          bottomRight: enableResizing,
          left: enableResizing,
          right: enableResizing,
          top: enableResizing,
          topLeft: enableResizing,
          topRight: enableResizing
        }}
        disableDragging={disableDragging}
        onMouseDown={onItemClickHandler}
        style={{ zIndex: order, opacity: locked ? 0.75 : 1 }}
        minWidth={minSizeToResize}
        minHeight={minSizeToResize}
      >
        <div
          className={[
            classes.activeItemBoxContainer,
            active ? classes.activeItemBoxHorizontal : ''
          ].join(' ')}
        >
          {(active || selected) && (
            <Fragment>
              <div
                className={[
                  classes.activeItemBoxContainer,
                  classes.activeItemBoxVertical
                ].join(' ')}
              />
              <span
                className={[
                  classes.activeItemBoxPoint,
                  classes.activeItemBoxPointTopLeft
                ].join(' ')}
              />
              <span
                className={[
                  classes.activeItemBoxPoint,
                  classes.activeItemBoxPointTopCenter
                ].join(' ')}
              />
              <span
                className={[
                  classes.activeItemBoxPoint,
                  classes.activeItemBoxPointTopRight
                ].join(' ')}
              />
              <span
                className={[
                  classes.activeItemBoxPoint,
                  classes.activeItemBoxPointRightCenter
                ].join(' ')}
              />
              <span
                className={[
                  classes.activeItemBoxPoint,
                  classes.activeItemBoxPointBottomRight
                ].join(' ')}
              />
              <span
                className={[
                  classes.activeItemBoxPoint,
                  classes.activeItemBoxPointBottomCenter
                ].join(' ')}
              />
              <span
                className={[
                  classes.activeItemBoxPoint,
                  classes.activeItemBoxPointBottomLeft
                ].join(' ')}
              />
              <span
                className={[
                  classes.activeItemBoxPoint,
                  classes.activeItemBoxPointLeftCenter
                ].join(' ')}
              />
            </Fragment>
          )}
          <div
            className={[classes.container, 'TemplateItem--container'].join(' ')}
            style={{
              background: styles.background,
              transform: `scaleX(${styles.hFlip ? -1 : 1}) scaleY(${
                styles.vFlip ? -1 : 1
              }) rotate(${styles.rotate}deg)`,
              borderTopLeftRadius: styles.borderTopLeftRadius / multiplier,
              borderTopRightRadius: styles.borderTopRightRadius / multiplier,
              borderBottomLeftRadius:
                styles.borderBottomLeftRadius / multiplier,
              borderBottomRightRadius:
                styles.borderBottomRightRadius / multiplier,
              borderWidth: styles.borderWidth / multiplier,
              borderColor: styles.borderColor,
              borderStyle: 'solid',
              opacity: styles.opacity
            }}
          >
            <Grid
              className={classes.labelContainer}
              style={{
                transform: `scaleX(${styles.hFlip ? -1 : 1}) scaleY(${
                  styles.vFlip ? -1 : 1
                })`,
                position: 'relative',
                top: `${60 / multiplier}px`,
                left: `${60 / multiplier}px`,
                width: 'fit-content'
              }}
            >
              <i
                className={[classes.labelIcon, icon].join(' ')}
                style={{ fontSize: 30 / multiplier }}
              />
              <Typography
                className={classes.labelText}
                style={{ fontSize: 27 / multiplier }}
              >
                {title}
              </Typography>
            </Grid>
            <Grid
              className={[
                classes.buttonsContainer,
                'TemplateItem__buttons-container'
              ].join(' ')}
            >
              <BlueButton
                classes={{
                  root: [
                    classes.button,
                    touchOpened ? '' : 'TemplateItem__button'
                  ].join(' ')
                }}
                onClick={() => setTouchContentModal(true)}
              >
                <TouchIcon className={classes.buttonIcon} />
              </BlueButton>

              <BlueButton
                classes={{
                  root: [
                    classes.button,
                    detailsOpened ? '' : 'TemplateItem__button'
                  ].join(' ')
                }}
                onClick={() => setMediaDetailsModal(true)}
              >
                <EditIcon className={classes.buttonIcon} />
              </BlueButton>
            </Grid>
          </div>
        </div>
      </Rnd>

      <Details
        detailsType={
          mediaDetailsModal
            ? 'mediaDetails'
            : touchContentModal
            ? 'touchContent'
            : ''
        }
        open={mediaDetailsModal || touchContentModal}
        closeHandler={() => {
          if (mediaDetailsModal) setMediaDetailsModal(false)
          if (touchContentModal) setTouchContentModal(false)
        }}
        itemId={id}
        title={title}
        featureId={featureId}
        media={media}
        touch={touch}
      />
    </Fragment>
  )
}

TemplateItem.propTypes = {
  id: PropTypes.number.isRequired,
  size: PropTypes.object.isRequired,
  position: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired,
  multiplier: PropTypes.number.isRequired,
  showGrid: PropTypes.bool.isRequired,
  snapToGrid: PropTypes.bool.isRequired,
  videoWall: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  anotherActive: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  gridCoords: PropTypes.object
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setCurrentTemplateItem,
      updateCurrentTemplateItem,
      toggleTemplateItemToSelected
    },
    dispatch
  )

export default withStyles(styles)(
  connect(null, mapDispatchToProps)(TemplateItem)
)
