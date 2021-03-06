import React, { useState, useCallback, useMemo } from 'react'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
import { compose } from 'redux'
import ModalWrapper from './ModalWrapper'
import ModalOverflowedWrapper from './ModalOverflowedWrapper'

import { withStyles, Grid, Typography, Slide, Fade } from '@material-ui/core'
import { Close } from '@material-ui/icons'

import { CircleIconButton } from 'components/Buttons'

const styles = ({ palette, type, typography }) => ({
  sideModalWrap: {
    display: 'flex',
    flexDirection: 'row-reverse',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    zIndex: 11
  },
  sideModal: {
    minHeight: '100%',
    height: 'max-content',
    background: palette[type].sideModal.background,
    borderRadius: '0 8px 8px 0'
  },
  sideModalInner: {
    height: '100%'
  },
  leftRadius: {
    borderRadius: '8px'
  },
  sideModalContent: {
    flex: '1 1 auto',
    maxHeight: 'calc(100% - 106px)',
    height: '100%'
  },
  sideModalHeader: {
    padding: '30px 35px'
  },
  sideModalFooter: {
    padding: 10,
    borderTop: `1px solid ${palette[type].sideModal.footer.border}`,
    backgroundColor: palette[type].sideModal.footer.backgroundColor
  },
  sideModalHeaderTitle: {
    ...typography.darkText[type],
    fontSize: '1.125rem'
  },
  icon: {
    color: palette[type].sideModal.header.titleColor
  }
})

const TRANSITION_DURATION = 250

const SideModal = ({
  history,
  classes,
  children,
  title,
  closeLink,
  headerClassName = '',
  leftBorderRadius = false,
  wrapClassName = '',
  innerClassName = '',
  childrenWrapperClass,
  footerClassName,
  footerLayout,
  width = '90%',
  animated = true,
  displayOverflow = false
}) => {
  const [mounted, setMounted] = useState(true)
  const [transitionDuration] = useState(animated ? TRANSITION_DURATION : 0)

  const closeAnimated = useCallback(() => {
    const timer = setTimeout(() => {
      history.push(closeLink)
      clearTimeout(timer)
    }, transitionDuration)
  }, [transitionDuration, history, closeLink])

  const closeInstantly = useCallback(() => {
    history.push(closeLink)
  }, [history, closeLink])

  const handleCloseClick = useCallback(() => {
    setMounted(false)
    return animated ? closeAnimated() : closeInstantly()
  }, [setMounted, animated, closeAnimated, closeInstantly])

  const WrapperComponent = useMemo(
    () => (displayOverflow ? ModalOverflowedWrapper : ModalWrapper),
    [displayOverflow]
  )
  const backgroundGradient = useMemo(
    () =>
      width === '100%'
        ? ' transparent'
        : `linear-gradient(to left, rgba(255, 255, 255, 0) 5%, rgba(90, 90, 90, 0.16) ${width}, rgba(255, 255, 255, 0) 100%)`,
    [width]
  )
  return (
    <Fade mountOnEnter unmountOnExit in={mounted} timeout={transitionDuration}>
      <div
        className={`${classes.sideModalWrap} ${wrapClassName}`}
        style={{
          background: backgroundGradient
        }}
      >
        <div id="draggable" />
        <Slide
          direction="left"
          mountOnEnter
          unmountOnExit
          in={mounted}
          timeout={transitionDuration}
        >
          <WrapperComponent
            width={width}
            leftBorderRadius={leftBorderRadius}
            innerClassName={innerClassName}
          >
            <Grid item>
              <header
                className={[classes.sideModalHeader, headerClassName].join(' ')}
              >
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography className={classes.sideModalHeaderTitle}>
                      {title}
                    </Typography>
                  </Grid>
                  {closeLink && (
                    <Grid item>
                      <CircleIconButton
                        className={[classes.icon, 'hvr-grow'].join(' ')}
                        // component={Link}
                        // to={closeLink}
                        onClick={handleCloseClick}
                      >
                        <Close />
                      </CircleIconButton>
                    </Grid>
                  )}
                </Grid>
              </header>
            </Grid>
            <Grid
              item
              className={classNames(
                classes.sideModalContent,
                childrenWrapperClass
              )}
            >
              {children}
            </Grid>
            {footerLayout ? (
              <Grid item>
                <footer
                  className={[classes.sideModalFooter, footerClassName].join(
                    ' '
                  )}
                >
                  <Grid container>{footerLayout}</Grid>
                </footer>
              </Grid>
            ) : null}
          </WrapperComponent>
        </Slide>
      </div>
    </Fade>
  )
}

export default compose(withRouter, withStyles(styles))(SideModal)
