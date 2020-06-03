import React from 'react'
import PropTypes from 'prop-types'

import { translate } from 'react-i18next'

import { Grid, Typography, withStyles } from '@material-ui/core'

const styles = theme => {
  const { palette, type } = theme
  return {
    container: {
      padding: '50px 0',
      minHeight: '80vh'
    },
    text: {
      color: palette[type].loader.color,
      fontWeight: 700
    }
  }
}

const Loader = ({
  t,
  classes,
  titleClassName = '',
  containerClassName = ''
}) => (
  <Grid
    container
    justify="center"
    className={[classes.container, containerClassName].join(' ')}
  >
    <Typography
      className={[classes.text, titleClassName].join(' ')}
      variant="h4"
    >
      {t('Loading...')}
    </Typography>
  </Grid>
)

Loader.propTypes = {
  classes: PropTypes.object,
  titleClassName: PropTypes.string,
  containerClassName: PropTypes.string
}

export default translate('translations')(withStyles(styles)(Loader))
