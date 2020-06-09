import React from 'react'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'

import { Grid, withStyles, Typography } from '@material-ui/core'

const styles = ({ palette, type, typography }) => ({
  detailRow: {
    minHeight: '36px',
    borderBottom: `1px solid ${palette[type].deviceCard.row.background}`
  },
  detailLabel: {
    ...typography.lightText[type]
  },
  detailValue: {
    ...typography.darkText[type]
  }
})

const DeviceInfoRow = ({ t, classes, title, children, customValueType }) => (
  <Grid
    className={classes.detailRow}
    container
    justify="space-between"
    alignItems="center"
  >
    <Grid item>
      <Typography className={classes.detailLabel}>{t(title)}</Typography>
    </Grid>
    {customValueType ? (
      children
    ) : (
      <Grid item>
        <Typography className={classes.detailValue}>{children}</Typography>
      </Grid>
    )}
  </Grid>
)

DeviceInfoRow.propTypes = {
  title: PropTypes.string.isRequired,
  customValueType: PropTypes.bool
}
DeviceInfoRow.defaultProps = {
  customValueType: false
}

export default translate('translations')(withStyles(styles)(DeviceInfoRow))
