import React from 'react'
import classNames from 'classnames'
import { withStyles, Grid } from '@material-ui/core'

const styles = ({ palette, type }) => ({
  sideModal: {
    height: '100%',
    background: palette[type].sideModal.background,
    borderRadius: '0 8px 8px 0'
  },
  leftRadius: {
    borderRadius: '8px'
  }
})

const ModalWrapper = ({
  width,
  classes,
  leftBorderRadius,
  innerClassName,
  children
}) => (
  <Grid
    container
    direction="column"
    alignItems="stretch"
    wrap="nowrap"
    style={{
      width
    }}
    className={classNames(
      classes.sideModal,
      { [classes.leftRadius]: leftBorderRadius },
      innerClassName
    )}
  >
    {children}
  </Grid>
)

export default withStyles(styles)(ModalWrapper)
