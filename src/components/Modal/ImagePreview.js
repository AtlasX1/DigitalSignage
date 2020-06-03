import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/styles'
import {
  Close as CloseIcon,
  ZoomOutMap as ZoomOutMapIcon,
  DragIndicator as DragIndicatorIcon
} from '@material-ui/icons'
import { ClickAwayListener } from '@material-ui/core'
import classNames from 'classnames'
import { translate } from 'react-i18next'
import { Resizable } from 're-resizable'
import Draggable from 'react-draggable'
import { withSnackbar } from 'notistack'

import useWindowDimensions from 'hooks/useWindowDimensions'

const useStyles = makeStyles({
  screenPreviewModalWrap: {
    position: 'relative'
  },
  screenPreviewModal: {
    position: 'fixed',
    overflow: 'auto',
    top: 0,
    left: 0,
    minWidth: '52px',
    minHeight: '56px',
    border: '1px solid #e6eaf4',
    background: '#fff',
    boxShadow: '0 2px 4px 0 #b6bac6',
    borderRadius: props => (props.isFullScreen ? '0' : '8px'),
    zIndex: 120
  },
  modal: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: '10px'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto'
  },
  controlsItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2.5px',
    marginLeft: '5px',
    transition: 'opacity .25s ease, color .25s ease',
    '&:first-child': {
      marginLeft: 0
    },
    '&.draggable-handle': {
      cursor: 'move',
      '&:hover': {
        cursor: 'move'
      }
    },
    '&:hover, &.is-active': {
      cursor: 'pointer',
      color: '#3f51b5'
    },
    '&.is-disable': {
      color: 'inherit',
      opacity: '0.5',
      cursor: 'default !important'
    }
  },
  modalContent: {
    padding: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2
  }
})

const ImagePreview = ({ isOpen, screenPreview, onModalClose }) => {
  const [isResizing, setResizing] = useState(false)
  const [isFullScreen, setFullScreen] = useState(false)
  const windowDimensions = useWindowDimensions()
  const classes = useStyles({ isFullScreen })

  const [dimensions, setDimensions] = useState({ width: 1440, height: 720 })
  const [oldDimensions, setOldDimensions] = useState(null)
  const [modalPosition, setModalPosition] = useState()

  const setModalCenter = sizes => {
    if (!sizes) sizes = dimensions
    const { width, height } = sizes
    const x = (windowDimensions.width - width) / 2
    const y = (windowDimensions.height - height) / 2
    setModalPosition({ x, y })
  }

  const handleFullScreen = () => {
    const body = document.querySelector('body')

    if (isFullScreen) {
      body.style.overflowY = 'auto'
      setDimensions(oldDimensions)
      setOldDimensions(null)
    } else {
      body.style.overflowY = 'hidden'
      setOldDimensions(dimensions)
      const { innerWidth, innerHeight } = window
      setDimensions({
        width: innerWidth,
        height: innerHeight
      })
    }

    setFullScreen(!isFullScreen)
  }

  useEffect(() => {
    if (isFullScreen) {
      const { width, height } = windowDimensions
      setDimensions({ width, height })
    }
    // eslint-disable-next-line
  }, [windowDimensions])

  useEffect(() => {
    setModalCenter()
    // eslint-disable-next-line
  }, [isFullScreen])

  useEffect(() => {
    if (isFullScreen) {
      setModalCenter()
    }
    // eslint-disable-next-line
  }, [dimensions])

  useEffect(() => {
    const { width, height } = windowDimensions
    if (dimensions.width > width || dimensions.height > height) {
      const newDimensions = {
        width: width - (width / 100) * 30,
        height: height - (height / 100) * 15
      }
      setDimensions(newDimensions)
      setModalCenter(newDimensions)
    } else {
      setModalCenter()
    }
    // eslint-disable-next-line
  }, [])

  const handleModalClose = () => {
    onModalClose()
  }

  return (
    <div className={classes.screenPreviewModalWrap}>
      {isOpen && (
        <ClickAwayListener
          onClickAway={() => {
            if (!isResizing) handleModalClose()
          }}
        >
          <Draggable
            disabled={isFullScreen}
            handle=".draggable-handle"
            onStop={(e, data) => setModalPosition({ x: data.x, y: data.y })}
            position={modalPosition}
          >
            <div className={classes.screenPreviewModal}>
              <Resizable
                minWidth={480}
                minHeight={240}
                enable={{
                  top: !isFullScreen,
                  right: !isFullScreen,
                  bottom: !isFullScreen,
                  left: false,
                  topRight: !isFullScreen,
                  bottomRight: !isFullScreen,
                  bottomLeft: false,
                  topLeft: false
                }}
                size={{ width: dimensions.width, height: dimensions.height }}
                onResizeStart={() => {
                  setResizing(true)
                }}
                onResizeStop={(e, direction, ref, d) => {
                  const newWidth = dimensions.width + d.width
                  const newHeight = dimensions.height + d.height
                  setDimensions({ width: newWidth, height: newHeight })
                  setResizing(false)
                }}
              >
                <div className={classes.modal}>
                  <div className={classes.modalHeader}>
                    <div className={classes.controls}>
                      <div
                        className={classNames(
                          classes.controlsItem,
                          'draggable-handle',
                          {
                            'is-disable': isFullScreen
                          }
                        )}
                      >
                        <DragIndicatorIcon />
                      </div>

                      <div
                        className={classNames(classes.controlsItem, {
                          'is-active': isFullScreen
                        })}
                        onClick={handleFullScreen}
                      >
                        <ZoomOutMapIcon />
                      </div>

                      <div
                        className={classes.controlsItem}
                        onClick={handleModalClose}
                      >
                        <CloseIcon />
                      </div>
                    </div>
                  </div>
                  <div className={classes.modalContent}>
                    {screenPreview && <img alt="" src={screenPreview} />}
                  </div>
                </div>
              </Resizable>
            </div>
          </Draggable>
        </ClickAwayListener>
      )}
    </div>
  )
}

ImagePreview.defaultProps = {
  screenPreview: null,
  previewId: null
}

export default translate('translations')(withSnackbar(ImagePreview))
