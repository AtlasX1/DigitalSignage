import { Button, CircularProgress, ClickAwayListener } from '@material-ui/core'
import { withTheme } from '@material-ui/core/styles'
import {
  Close as CloseIcon,
  DragIndicator as DragIndicatorIcon,
  ZoomOutMap as ZoomOutMapIcon
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import classNames from 'classnames'
import { withSnackbar } from 'notistack'
import { Resizable } from 're-resizable'
import React, { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import { translate } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { closeMediaPreview, clearMediaPreview } from 'actions/mediaActions'
import useWindowDimensions from 'hooks/useWindowDimensions'

const useStyles = makeStyles({
  screenPreviewModalWrap: {
    position: 'relative'
  },
  screenPreviewModal: {
    position: 'fixed',
    overflow: 'hidden',
    top: 0,
    left: 0,
    minWidth: '52px',
    minHeight: '56px',
    border: 'none',
    background: ({ palette, type }) => palette[type].card.background,
    boxShadow: ({ palette, type }) =>
      `0 2px 4px 0 ${palette[type].modal.shadow}`,
    borderRadius: props => (props.isFullScreen ? '0' : '8px'),
    zIndex: 120
  },
  childrenWrap: {
    cursor: 'pointer'
  },
  progress: {
    color: '#1c5dca'
  },
  iframeWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    '& iframe': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    }
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
    color: ({ palette, type }) => palette[type].card.greyHeader.color,
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
  },
  modalLoader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 2
  }
})

const ScreenPreviewModal = ({ t, enqueueSnackbar, closeSnackbar, theme }) => {
  const iframeRef = useRef(null)
  const [isResizing, setResizing] = useState(false)
  const [isFullScreen, setFullScreen] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 1440, height: 720 })
  const [oldDimensions, setOldDimensions] = useState(null)
  const [modalPosition, setModalPosition] = useState()
  const [iframeSrc, setIframeSrc] = useState(null)
  const [isIframeReady, setIframeReady] = useState(false)
  const { palette, type } = theme
  const classes = useStyles({ isFullScreen, palette, type })
  const dispatchAction = useDispatch()
  const windowDimensions = useWindowDimensions()
  const { isVisible, isLoading, response, error, id: previewId } = useSelector(
    ({ media }) => media.preview
  )

  const setModalCenter = sizes => {
    if (!sizes) sizes = dimensions
    const { width, height } = sizes
    const x = (windowDimensions.width - width) / 2
    const y = (windowDimensions.height - height) / 2
    setModalPosition({ x, y })
  }

  const setIframeStyles = () => {
    if (isVisible && isIframeReady) {
      const iframeContent = iframeRef.current.contentWindow
      iframeContent.document.head.insertAdjacentHTML(
        'beforeend',
        `<style>#vimeoIframe, iframe {width: 100%; height: 100%}</style>`
      )
    }
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

  const handleModalClose = () => {
    if (isFullScreen) handleFullScreen()
    setIframeReady(false)

    if (iframeSrc) {
      URL.revokeObjectURL(iframeSrc)
    }
    setIframeSrc(null)

    dispatchAction(clearMediaPreview())
    dispatchAction(closeMediaPreview())
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
    if (isLoading) return
    if (response) {
      const blob = new Blob([response], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      setIframeSrc(url)
    }

    if (error) {
      handleModalClose()
      enqueueSnackbar(t('Error'), {
        variant: 'default',
        action: key => (
          <Button
            color="secondary"
            size="small"
            onClick={() => closeSnackbar(key)}
          >
            {t('OK')}
          </Button>
        )
      })
    }
    // eslint-disable-next-line
  }, [response, error, isLoading])

  useEffect(() => {
    setIframeSrc(null)
    // eslint-disable-next-line
  }, [previewId])

  useEffect(() => {
    if (isFullScreen) {
      setModalCenter()
    }
    // eslint-disable-next-line
  }, [dimensions])

  useEffect(() => {
    if (isVisible && isIframeReady) {
      setIframeStyles()
    }
    // eslint-disable-next-line
  }, [isIframeReady, isVisible])

  useEffect(() => {
    if (isVisible) {
    }
    // eslint-disable-next-line
  }, [isVisible])

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

  return (
    <div className={classes.screenPreviewModalWrap}>
      {isVisible && (
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
                  {isLoading && (
                    <div className={classes.modalLoader}>
                      <CircularProgress
                        size={30}
                        thickness={5}
                        className={classes.progress}
                      />
                    </div>
                  )}

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
                        onClick={() => handleFullScreen()}
                      >
                        <ZoomOutMapIcon />
                      </div>

                      <div
                        className={classes.controlsItem}
                        onClick={() => handleModalClose()}
                      >
                        <CloseIcon />
                      </div>
                    </div>
                  </div>
                  <div className={classes.modalContent}>
                    {iframeSrc && (
                      <div className={classes.iframeWrapper}>
                        <iframe
                          title="screenPreviewModal"
                          ref={iframeRef}
                          src={iframeSrc}
                          onLoad={() => setIframeReady(true)}
                          frameBorder="0"
                        />
                      </div>
                    )}
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

export default translate('translations')(
  withSnackbar(withTheme()(ScreenPreviewModal))
)
