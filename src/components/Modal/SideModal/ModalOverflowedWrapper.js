import React, { useRef, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'
import _get from 'lodash/get'
import { setGroupModalHeight } from 'actions/appActions'
import { withStyles, Grid } from '@material-ui/core'

const styles = ({ palette, type }) => ({
  sideModal: {
    minHeight: '100%',
    height: 'max-content',
    background: palette[type].sideModal.background,
    borderRadius: '0 8px 8px 0'
  },
  leftRadius: {
    borderRadius: '8px'
  },
  sideModalInner: {
    height: '100%'
  }
})

const ModalOverflowedWrapper = ({
  width,
  classes,
  leftBorderRadius,
  innerClassName,
  children
}) => {
  const dispatch = useDispatch()
  const onModalResize = useCallback(
    entries => {
      const height = _get(entries, '[0].contentRect.height', 0)
      dispatch(setGroupModalHeight(height))
    },
    [dispatch]
  )

  const sideModalRef = useRef()
  const observerRef = useRef(new ResizeObserver(onModalResize))

  useEffect(() => {
    const modalElem = sideModalRef.current
    if (!modalElem) {
      return
    }

    const observer = new ResizeObserver(onModalResize).observe(modalElem)
    observerRef.current = observer
    return () => {
      dispatch(setGroupModalHeight(0))
      if (observer) {
        observer.unobserve(modalElem)
      }
    }
  }, [sideModalRef, onModalResize, dispatch])

  return (
    <div
      style={{
        width
      }}
      className={classNames(
        classes.sideModal,
        { [classes.leftRadius]: leftBorderRadius },
        innerClassName
      )}
      ref={sideModalRef}
    >
      <Grid
        container
        direction="column"
        alignItems="stretch"
        wrap="nowrap"
        className={classes.sideModalInner}
      >
        {children}
      </Grid>
    </div>
  )
}

export default withStyles(styles)(ModalOverflowedWrapper)
