import React from 'react'
import { translate } from 'react-i18next'
import { compose } from 'redux'
import { Grid, withStyles, Typography } from '@material-ui/core'
import AccountModal from './AccountModal'
import AccessDeniedImage from 'common/assets/images/unauthorizedlocaton.png'

function styles() {
  return {
    image: {
      width: 500
    },
    textContainer: {
      marginBottom: 150
    },
    text: {
      fontSize: 18,
      textAlign: 'center',
      whiteSpace: 'pre',
      fontWeight: 600,

      '&:not(:last-child)': {
        marginBottom: 20
      }
    }
  }
}

function AccessDenied({ t, classes }) {
  return (
    <AccountModal>
      <Grid container justify="center" direction="column">
        <Grid container justify="center">
          <img
            src={AccessDeniedImage}
            alt="access-denied"
            className={classes.image}
          />
        </Grid>
        <Grid container justify="center" className={classes.textContainer}>
          <Typography className={classes.text}>
            {t(
              'You are attempting to access this application from unauthorized location'
            )}
          </Typography>
          <Typography className={classes.text}>
            {t(
              'Please contact your System Administrator for further assistance'
            )}
          </Typography>
        </Grid>
      </Grid>
    </AccountModal>
  )
}

export default compose(
  translate('translations'),
  withStyles(styles)
)(AccessDenied)
